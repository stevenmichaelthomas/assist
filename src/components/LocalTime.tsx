"use client";

import { useEffect, useState } from "react";

export function LocalTime({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(new Date(date).toLocaleString());
  }, [date]);

  return <span className={className}>{formatted}</span>;
}
