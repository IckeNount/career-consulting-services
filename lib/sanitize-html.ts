import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe HTML tags commonly used in rich text editors
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== "string") return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "video",
      "iframe",
      "pre",
      "code",
      "span",
      "div",
    ],
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "width",
      "height",
      "style",
      "class",
      "target",
      "rel",
      "controls",
      "allowfullscreen",
      "frameborder",
    ],
    ALLOW_DATA_ATTR: false,
  });
}
