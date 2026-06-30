import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Sheikh Rahil",
  description: "Privacy Policy and terms of use for Sheikh Rahil's official website.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <h1 className="text-3xl font-serif text-primary mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm"><strong>Effective Date:</strong> July 1, 2026</p>

        <p>
          Welcome to the official website of Sheikh Rahil (the &quot;Website&quot;). This Privacy Policy explains how we collect, use, protect, and handle your personal information when you visit our Website.
        </p>
        <p>
          By using the Website, you consent to the data practices described in this policy.
        </p>

        <h3 className="text-xl font-semibold text-primary mt-8">1. Information We Collect</h3>
        <p>We strive to collect only the minimal amount of information necessary to operate the Website effectively.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Information You Provide to Us:</strong> The only personal information we actively collect is what you voluntarily provide through our Contact Form. When you send a message, we collect your <strong>Name</strong> and <strong>Email Address</strong>, along with the contents of your message.</li>
          <li><strong>Information Collected Automatically:</strong> Like most standard websites, we may automatically log basic, non-personally identifiable information when you visit. This may include your IP address, browser type, operating system, referring URLs, and pages viewed. This data is used solely for analyzing site traffic and improving user experience.</li>
        </ul>

        <h3 className="text-xl font-semibold text-primary mt-8">2. How We Use Your Information</h3>
        <p>The information we collect is used strictly for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To read and respond to your messages, inquiries, or feedback submitted via the contact form.</li>
          <li>To ensure the Website functions properly and to improve its layout and content.</li>
          <li>To prevent spam, fraud, or abuse of the contact form.</li>
        </ul>
        <p className="italic">We do not use your email address to send unsolicited marketing newsletters unless you explicitly opt in to such a service.</p>

        <h3 className="text-xl font-semibold text-primary mt-8">3. Data Sharing and Disclosure</h3>
        <p>We value your privacy and maintain a strict policy regarding your data.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No Third-Party Sharing:</strong> We <strong>do not</strong> sell, trade, rent, or otherwise share your personal information (including your name and email address) with any third-party marketing companies, advertisers, or external organizations.</li>
          <li><strong>Legal Requirements:</strong> The only exception to this rule is if we are required to disclose your information by law. We may share your data if served with a valid subpoena, court order, or other legal process, or if necessary to protect the rights, property, or safety of the author, the web developer, or the public.</li>
        </ul>

        <h3 className="text-xl font-semibold text-primary mt-8">4. Data Security</h3>
        <p>
          We implement reasonable security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
        </p>

        <h3 className="text-xl font-semibold text-primary mt-8">5. Cookies</h3>
        <p>
          The Website may use &quot;cookies&quot; (small data files placed on your device) to enhance your browsing experience, remember your preferences, or compile aggregate data about site traffic. You can choose to disable cookies through your web browser settings; however, doing so may affect your ability to use certain features of the site.
        </p>

        <h3 className="text-xl font-semibold text-primary mt-8">6. Disclaimer and Limitation of Liability</h3>
        <p><strong>Please read this section carefully.</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Content Disclaimer:</strong> The poems, quotes, and all other content provided on this Website are for artistic, literary, and entertainment purposes only. The author (Sheikh Rahil) reserves the right to modify or remove content at any time without notice.</li>
          <li><strong>No Liability:</strong> To the maximum extent permitted by applicable law, neither the author (Sheikh Rahil) nor the web developer (Qurevo Technologies) shall be held liable for any direct, indirect, incidental, consequential, or special damages arising out of your use of, or inability to use, this Website.</li>
          <li><strong>&quot;As Is&quot; Basis:</strong> The Website and its contents are provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties of any kind, either express or implied. We do not guarantee that the Website will be error-free, uninterrupted, or free from viruses or other harmful components. You use this Website entirely at your own risk.</li>
        </ul>

        <h3 className="text-xl font-semibold text-primary mt-8">7. Third-Party Links</h3>
        <p>
          Our Website may occasionally contain links to third-party websites (such as social media profiles). If you click on a third-party link, you will be directed to that site. We do not operate these external sites and have no control over their content or privacy practices. We strongly advise you to review the Privacy Policy of every site you visit.
        </p>

        <h3 className="text-xl font-semibold text-primary mt-8">8. Changes to This Privacy Policy</h3>
        <p>
          We reserve the right to update or change our Privacy Policy at any time. Any changes will be posted on this page with an updated &quot;Effective Date&quot; at the top. Your continued use of the Website after any modifications indicates your acceptance of the updated policy.
        </p>

        <h3 className="text-xl font-semibold text-primary mt-8">9. Contact Us</h3>
        <p>
          If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out to us using the <Link href="/contact" className="text-primary underline hover:opacity-80">Contact Form</Link> on this website.
        </p>
      </article>
    </main>
  );
}