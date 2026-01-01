import { Helmet } from "react-helmet-async";

const DEFAULT_KEYWORDS =
  "news, breaking news, latest news, india news, channel h media";

export default function DefaultSEO() {
  return (
    <Helmet>
      <meta name="keywords" content={DEFAULT_KEYWORDS} />
    </Helmet>
  );
}
