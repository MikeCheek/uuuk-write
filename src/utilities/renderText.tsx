import React from "react";
import HighlightedText from "../components/atoms/HighlightedText";
import CircledText from "../components/atoms/CircledText";

export default function renderText(text: string): (string | JSX.Element)[] {
  // Regex to match text wrapped in triple hashtags, triple asterisks, or <br> tags
  const regex = /###(.*?)###|\*\*\*(.*?)\*\*\*|(<br\s*\/?>)/g;
  let lastIndex = 0;
  const parts: (string | JSX.Element)[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    // Push any text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Determine which group matched and push the corresponding component or element
    if (match[1] !== undefined) {
      // Triple hashtags match => HighlightedText component
      parts.push(<HighlightedText key={match.index} text={match[1]} />);
    } else if (match[2] !== undefined) {
      // Triple asterisks match => CircledText component
      parts.push(<CircledText key={match.index} text={match[2]} />);
    } else if (match[3] !== undefined) {
      // <br> tag match => React <br /> element
      parts.push(<br key={match.index} />);
    }
    lastIndex = regex.lastIndex;
  }

  // Push any remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
