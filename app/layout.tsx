import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Alberta Health Data Atlas｜阿省健康数据学习站";
const description =
  "中英双语导学 Alberta 健康行政数据与临床信息系统：探索 9 个常用数据集，并通过 DAD、NACRS、PIN 字段地图与研究案例学习队列设计、联结、申请与责任使用。A bilingual guide to nine Alberta health datasets, with DAD, NACRS, and PIN field maps and research examples.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: [
      "Alberta health data",
      "AHS datasets",
      "DAD",
      "NACRS",
      "health informatics",
      "健康数据",
      "行政健康数据",
    ],
    alternates: {
      canonical: baseUrl,
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      alternateLocale: ["en_CA"],
      title,
      description,
      url: baseUrl,
      siteName: "Alberta Health Data Atlas",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1734,
          height: 907,
          alt: "Alberta Health Data Atlas — 9 datasets, guided learning, responsible access",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og.png`],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c2f33",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
