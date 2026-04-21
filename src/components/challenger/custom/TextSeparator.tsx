"use client";

import * as React from "react";

export type TextSeparatorProps = {
  text: string;
};

const TextSeparator = ({ text }: TextSeparatorProps) => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t"></span>
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">{text}</span>
    </div>
  </div>
);
TextSeparator.displayName = "TextSeparator";

export { TextSeparator };
