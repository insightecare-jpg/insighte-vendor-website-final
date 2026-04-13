"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ArticleBodyProps {
  content: string;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <article className="prose prose-insighte prose-invert max-w-none prose-p:font-sans prose-p:text-text-primary prose-headings:text-text-primary prose-strong:text-text-primary">
      <ReactMarkdown
        components={{
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-accent border-l-[3px] py-1 pl-6 my-10 italic text-text-secondary font-sans font-normal not-italic tracking-normal">
              {props.children}
            </blockquote>
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-[22px] font-semibold leading-tight mt-10 mb-3 text-text-primary uppercase tracking-tight" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-[18px] font-medium leading-tight mt-8 mb-2 text-text-primary uppercase tracking-tight" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-[16px] md:text-[17px] leading-[1.75] mb-6 text-text-primary/90 font-sans" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-6 space-y-2 text-text-primary/90" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-text-primary/90" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="pl-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-accent underline-offset-4 hover:underline transition-all" {...props} />
          ),
          img: ({ node, ...props }) => (
            <span className="block my-10">
              <img 
                {...props} 
                className="w-full rounded-[2rem] border border-white/5" 
              />
              {props.title && (
                <span className="block text-center text-xs text-zinc-500 mt-4 italic">
                  {props.title}
                </span>
              )}
            </span>
          ),
          strong: ({ node, children, ...props }) => {
            const textContent = React.Children.toArray(children).join("");
            if (textContent.includes("Try this at home:")) {
              return (
                <div className="my-10 p-8 rounded-3xl border-l-[4px] border-l-accent bg-accent/5 space-y-2 shadow-xl">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Try this at home</div>
                  <div className="text-sm leading-relaxed text-text-primary/90 italic">{textContent.replace("Try this at home:", "").trim()}</div>
                </div>
              );
            }
            return <strong className="font-bold text-white" {...props}>{children}</strong>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
