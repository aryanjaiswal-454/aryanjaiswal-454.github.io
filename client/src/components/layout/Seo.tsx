import { Helmet } from "react-helmet-async";
import site from "../../config/site.js";

export function Seo() {
  const jsonLd = JSON.stringify(site.metadata.jsonLd);

  return (
    <Helmet>
      <title>{site.metadata.title}</title>
      <meta name="description" content={site.metadata.description} />
      <link rel="canonical" href={site.metadata.canonical} />
      <meta property="og:type" content={site.metadata.openGraph.type} />
      <meta property="og:title" content={site.metadata.openGraph.title} />
      <meta property="og:description" content={site.metadata.openGraph.description} />
      <meta property="og:url" content={site.metadata.openGraph.url} />
      <meta property="og:image" content={site.metadata.openGraph.image} />
      <meta property="og:image:alt" content={site.metadata.openGraph.imageAlt} />
      <meta name="twitter:card" content={site.metadata.twitter.card} />
      <meta name="twitter:title" content={site.metadata.twitter.title} />
      <meta name="twitter:description" content={site.metadata.twitter.description} />
      <meta name="twitter:image" content={site.metadata.twitter.image} />
      <script type="application/ld+json">{jsonLd}</script>
    </Helmet>
  );
}
