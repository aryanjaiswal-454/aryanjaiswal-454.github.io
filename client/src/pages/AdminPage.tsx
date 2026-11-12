import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LogOut, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { FormEvent } from "react";
import site from "../config/site.js";
import {
  adminCreate,
  adminDelete,
  adminLogin,
  adminLogout,
  adminUpdate,
  getApiError,
  getCurrentAdmin,
  getAdminRecords
} from "../services/api";

type Resource = "projects" | "skills" | "posts" | "experience";
type RecordValue = Record<string, unknown> & { id?: string; _id?: string };
type FieldValue = string | boolean;

const resourceLabels: Record<Resource, string> = {
  projects: "Projects",
  skills: "Skills",
  posts: "Writing posts",
  experience: "Experience & education"
};

const fields: Record<Resource, Array<{ name: string; label: string; kind?: "textarea" | "checkbox" }>> = {
  projects: [
    { name: "title", label: "Title" },
    { name: "slug", label: "Slug" },
    { name: "category", label: "Category" },
    { name: "year", label: "Year" },
    { name: "summary", label: "Summary", kind: "textarea" },
    { name: "description", label: "Description", kind: "textarea" },
    { name: "techStack", label: "Tech stack (comma separated)" },
    { name: "githubUrl", label: "GitHub URL" },
    { name: "liveUrl", label: "Live URL" },
    { name: "demoUrl", label: "Demo URL" },
    { name: "image", label: "Image path" },
    { name: "featured", label: "Featured", kind: "checkbox" },
    { name: "order", label: "Display order" }
  ],
  skills: [
    { name: "group", label: "Group name" },
    { name: "items", label: "Skills (comma separated)", kind: "textarea" }
  ],
  posts: [
    { name: "title", label: "Title" },
    { name: "excerpt", label: "Excerpt", kind: "textarea" },
    { name: "url", label: "Post URL" },
    { name: "date", label: "Date" },
    { name: "featured", label: "Featured", kind: "checkbox" },
    { name: "order", label: "Display order" }
  ],
  experience: [
    { name: "type", label: "Type (experience or education)" },
    { name: "title", label: "Role title" },
    { name: "qualification", label: "Qualification" },
    { name: "organization", label: "Organization" },
    { name: "institution", label: "Institution" },
    { name: "location", label: "Location" },
    { name: "startDate", label: "Start date" },
    { name: "endDate", label: "End date" },
    { name: "description", label: "Description", kind: "textarea" },
    { name: "result", label: "Result" },
    { name: "status", label: "Status" }
  ]
};

function recordId(record: RecordValue) {
  return String(record.id || record._id || "");
}

function recordLabel(resource: Resource, record: RecordValue) {
  if (resource === "skills") return String(record.group || "Untitled skill group");
  if (resource === "experience") return String(record.title || record.qualification || record.institution || "Untitled timeline entry");
  return String(record.title || "Untitled record");
}

function initialValues(resource: Resource, record?: RecordValue): Record<string, FieldValue> {
  const result: Record<string, FieldValue> = {};
  for (const field of fields[resource]) {
    const value = record?.[field.name];
    if (field.kind === "checkbox") {
      result[field.name] = Boolean(value);
    } else if (field.name === "techStack" || field.name === "items") {
      result[field.name] = Array.isArray(value) ? value.join(", ") : "";
    } else {
      result[field.name] = value == null ? "" : String(value);
    }
  }
  if (resource === "experience" && !record) result.type = "experience";
  return result;
}

function payloadFor(resource: Resource, values: Record<string, FieldValue>) {
  const payload: Record<string, unknown> = { ...values };
  for (const key of ["techStack", "items"]) {
    if (typeof payload[key] === "string") {
      payload[key] = (payload[key] as string).split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  for (const key of ["year", "order"]) {
    if (typeof payload[key] === "string") payload[key] = payload[key] ? Number(payload[key]) : undefined;
  }
  for (const key of ["liveUrl", "demoUrl", "image", "date", "startDate", "endDate", "result", "status"]) {
    if (payload[key] === "") payload[key] = undefined;
  }
  if (resource === "experience") {
    if (payload.type !== "education") payload.type = "experience";
  }
  return payload;
}

export function AdminPage() {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [resource, setResource] = useState<Resource>("projects");
  const [records, setRecords] = useState<RecordValue[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordError, setRecordError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<RecordValue | null>(null);
  const [values, setValues] = useState<Record<string, FieldValue>>(() => initialValues("projects"));
  const [saving, setSaving] = useState(false);
  const title = useMemo(() => resourceLabels[resource], [resource]);

  useEffect(() => {
    let active = true;
    getCurrentAdmin()
      .then((admin) => { if (active) setAdminEmail(admin?.email || null); })
      .catch((error: unknown) => { if (active) setAuthError(getApiError(error)); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!adminEmail) return;
    let active = true;
    setRecordsLoading(true);
    setRecordError("");
    getAdminRecords<RecordValue>(resource)
      .then((data) => { if (active) setRecords(data); })
      .catch((error: unknown) => { if (active) setRecordError(getApiError(error)); })
      .finally(() => { if (active) setRecordsLoading(false); });
    setEditing(null);
    setValues(initialValues(resource));
    return () => { active = false; };
  }, [adminEmail, resource]);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    try {
      await adminLogin(loginEmail, loginPassword);
      setAdminEmail(loginEmail);
      setLoginPassword("");
    } catch (error) {
      setAuthError(getApiError(error));
    }
  };

  const editRecord = (record: RecordValue) => {
    setEditing(record);
    setValues(initialValues(resource, record));
    setNotice("");
  };

  const resetForm = () => {
    setEditing(null);
    setValues(initialValues(resource));
    setNotice("");
  };

  const saveRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setRecordError("");
    setNotice("");
    try {
      const payload = payloadFor(resource, values);
      if (editing) {
        await adminUpdate(resource, recordId(editing), payload);
      } else {
        await adminCreate(resource, payload);
      }
      setRecords(await getAdminRecords<RecordValue>(resource));
      resetForm();
      setNotice(`${resourceLabels[resource].replace(/s$/, "")} saved.`);
    } catch (error) {
      setRecordError(getApiError(error));
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (record: RecordValue) => {
    if (!window.confirm(`Delete “${recordLabel(resource, record)}”? This cannot be undone.`)) return;
    setRecordError("");
    setNotice("");
    try {
      await adminDelete(resource, recordId(record));
      setRecords(await getAdminRecords<RecordValue>(resource));
      if (editing && recordId(editing) === recordId(record)) resetForm();
      setNotice("Record deleted.");
    } catch (error) {
      setRecordError(getApiError(error));
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
      setAdminEmail(null);
      setRecords([]);
      setNotice("");
    } catch (error) {
      setAuthError(getApiError(error));
    }
  };

  if (authLoading) {
    return <main className="admin-page"><p className="admin-empty" role="status">Checking administrator session…</p></main>;
  }

  if (!adminEmail) {
    return (
      <main className="admin-page">
        <header className="admin-header">
          <Link className="wordmark" to="/" aria-label="Return to portfolio">
            <span className="wordmark__symbol">{site.identity.wordmark}</span><span className="wordmark__name">{site.identity.brandName}</span>
          </Link>
          <Link className="text-link" to="/"><ArrowLeft size={15} /> Portfolio</Link>
        </header>
        <section className="admin-login" aria-labelledby="admin-login-title">
          <span className="eyebrow">PRIVATE WORKSPACE</span>
          <h1 id="admin-login-title">Admin access.</h1>
          <p>Sign in with the administrator account configured on the server.</p>
          {authError && <p className="admin-message" role="alert">{authError}</p>}
          <form onSubmit={submitLogin}>
            <label className="form-field">
              <span>Email address</span>
              <input type="email" autoComplete="username" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} />
            </label>
            <label className="form-field">
              <span>Password</span>
              <input type="password" autoComplete="current-password" required value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} />
            </label>
            <button type="submit" className="button button--primary">Sign in</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link className="wordmark" to="/" aria-label="Return to portfolio">
          <span className="wordmark__symbol">{site.identity.wordmark}</span><span className="wordmark__name">{site.identity.brandName}</span>
        </Link>
        <span className="admin-header__label">CONTENT ADMIN / {adminEmail}</span>
        <button className="button button--outline button--small" type="button" onClick={logout}><LogOut size={14} /> Sign out</button>
      </header>
      <div className="admin-workspace">
        <nav className="admin-sidebar" aria-label="Content types">
          {(Object.keys(resourceLabels) as Resource[]).map((key) => (
            <button key={key} type="button" aria-pressed={resource === key} onClick={() => setResource(key)}>{resourceLabels[key]}</button>
          ))}
        </nav>
        <section className="admin-main" aria-labelledby="admin-content-title">
          <div className="admin-main__heading">
            <div><span className="eyebrow">MANAGE PORTFOLIO</span><h1 id="admin-content-title">{title}</h1></div>
            <button type="button" className="button button--primary" onClick={resetForm}><Plus size={16} /> New entry</button>
          </div>
          {recordError && <p className="admin-message" role="alert">{recordError}</p>}
          {notice && <p className="admin-message admin-message--success" role="status">{notice}</p>}
          <div className="admin-editor">
            <div className="admin-list" aria-label={`${title} records`}>
              {recordsLoading ? <p className="admin-empty" role="status">Loading records…</p> :
                records.length ? records.map((record) => (
                  <div className="admin-list__item" key={recordId(record)}>
                    <strong>{recordLabel(resource, record)}</strong>
                    <div>
                      <button type="button" onClick={() => editRecord(record)} aria-label={`Edit ${recordLabel(resource, record)}`}><Pencil size={15} /></button>
                      <button type="button" onClick={() => removeRecord(record)} aria-label={`Delete ${recordLabel(resource, record)}`}><Trash2 size={15} /></button>
                    </div>
                  </div>
                )) : <p className="admin-empty">No records available yet.</p>}
            </div>
            <form className="admin-form" onSubmit={saveRecord}>
              <span className="eyebrow">{editing ? "EDIT ENTRY" : "NEW ENTRY"}</span>
              {fields[resource].map((field) => (
                <label className={field.kind === "checkbox" ? "admin-form__checkbox" : undefined} key={field.name}>
                  {field.kind === "checkbox" ? (
                    <span><input
                      type="checkbox"
                      checked={Boolean(values[field.name])}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.checked }))}
                    /> {field.label}</span>
                  ) : (
                    <>
                      <span>{field.label}</span>
                      {field.kind === "textarea" ? (
                        <textarea
                          required={["summary", "description", "group", "items", "title", "excerpt", "url"].includes(field.name)}
                          value={String(values[field.name] || "")}
                          onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                        />
                      ) : (
                        <input
                          required={["title", "slug", "category", "summary", "description", "githubUrl", "group", "url"].includes(field.name)}
                          type={["year", "order"].includes(field.name) ? "number" : field.name.endsWith("Url") ? "url" : "text"}
                          value={String(values[field.name] || "")}
                          onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                        />
                      )}
                    </>
                  )}
                </label>
              ))}
              <div className="admin-form__actions">
                <button className="button button--primary" type="submit" disabled={saving}><Save size={14} /> {saving ? "Saving…" : "Save entry"}</button>
                {editing && <button className="button button--outline" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
