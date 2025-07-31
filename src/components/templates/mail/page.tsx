// import { cookies } from "next/headers";
import Image from "next/image";

import { Mail } from "@/components/templates/mail/components/mail";
import { accounts, mails } from "@/components/templates/mail/data";

export default function MailPage() {
  // const cookieStore = await cookies();
  // const layout = cookieStore.get("react-resizable-panels:layout:mail");
  // const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="md:hidden">
        <Image src="/examples/mail-dark.png" width={1280} height={727} alt="Mail" className="hidden dark:block" />
        <Image src="/examples/mail-light.png" width={1280} height={727} alt="Mail" className="block dark:hidden" />
      </div>
      <div className="hidden flex-col md:flex grow overflow-y-auto">
        <Mail accounts={accounts} mails={mails} defaultLayout={undefined} defaultCollapsed={undefined} navCollapsedSize={4} />
      </div>
    </>
  );
}
