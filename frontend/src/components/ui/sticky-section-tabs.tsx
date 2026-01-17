"use client";

import React, { Children, isValidElement } from 'react';
import clsx from 'clsx';

interface StickyTabItemProps {
  title: string;
  subtitle?: string;
  label?: string;
  id: string | number;
  children: React.ReactNode;
}

const StickyTabItem: React.FC<StickyTabItemProps> = () => {
  return null;
};

interface StickyTabsProps {
  children: React.ReactNode;
  mainNavHeight?: string;
}

const StickyTabs: React.FC<StickyTabsProps> & { Item: React.FC<StickyTabItemProps> } = ({
  children,
  mainNavHeight = '5rem',
}) => {
  const stickyTopValue = `calc(${mainNavHeight} - 1px)`;
  const navHeightStyle = { height: mainNavHeight };
  const stickyHeaderStyle = { top: stickyTopValue };

  return (
    <div className="overflow-clip bg-background">
      {/* Nav spacer */}
      <div
        className="sticky left-0 top-0 z-20 w-full border-b border-border/10 bg-background"
        style={navHeightStyle}
        aria-hidden="true"
      />

      {Children.map(children, (child) => {
        if (!isValidElement(child) || child.type !== StickyTabItem) {
          return null;
        }

        const itemElement = child as React.ReactElement<StickyTabItemProps>;
        const { title, subtitle, label, id, children: itemContent } = itemElement.props;

        return (
          <section
            key={id}
            className="relative overflow-clip"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,113,255,0.03),transparent_70%)] pointer-events-none" />
            
            {/* Sticky header */}
            <div
              className="sticky z-10 -mt-px flex flex-col bg-background/95 dark:bg-[#0D0D0D]/95 backdrop-blur-sm border-y border-border/10"
              style={stickyHeaderStyle}
            >
              <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-4 md:py-5">
                <div className="flex flex-col gap-1">
                  {/* Step label */}
                  {label && (
                    <span className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground font-medium">
                      {label}
                    </span>
                  )}
                  {/* Main title */}
                  <h2 className="font-inter text-xl md:text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
                    {title}
                  </h2>
                  {/* Subtitle */}
                  {subtitle && (
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-14">
              <div className="max-w-xl mx-auto">
                {itemContent}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

StickyTabs.Item = StickyTabItem;

export default StickyTabs;
