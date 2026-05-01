import { useState, useEffect } from "react";
import api from "../services/api";

export default function BookImage({ imageLink, alt, style }: { imageLink?: string; alt: string; style?: React.CSSProperties }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!imageLink) return;
    
    // Strip any service URL, keep only the path
    const gatewayUrl = imageLink
      .replace(/https?:\/\/localhost:\d+/, "")
      .replace(/https?:\/\/book-catalog-service\.onrender\.com/, "")
      .replace(/https?:\/\/[a-zA-Z0-9-]+\.onrender\.com/, "");

    api.get(gatewayUrl, { responseType: "blob" })
      .then((res) => setSrc(URL.createObjectURL(res.data)))
      .catch(() => setSrc(null));
  }, [imageLink]);

  if (!src) return null;
  return <img src={src} alt={alt} style={style} />;
}