import { useState, useEffect } from "react";
import api from "../services/api";

export default function BookImage({ imageLink, alt, style }: { imageLink?: string; alt: string; style?: React.CSSProperties }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!imageLink) return;
    const gatewayUrl = imageLink.replace(/http:\/\/localhost:\d+/, "");
    api.get(gatewayUrl, { responseType: "blob" })
      .then((res) => setSrc(URL.createObjectURL(res.data)))
      .catch(() => setSrc(null));
  }, [imageLink]);

  if (!src) return null;
  return <img src={src} alt={alt} style={style} />;
}
