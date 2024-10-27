import { Navigation } from "@/widget/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="py-5 w-full flex flex-col">
      <Link href={'/'} className="mx-auto flex justify-center my-6 ">
        <Image src='/logo.png' alt="logo" width={240} height={40} />
      </Link>

      <Navigation />
    </header>
  )
}