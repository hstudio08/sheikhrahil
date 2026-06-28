import { adminDb } from "@/lib/firebase/admin";
import { Mail, Calendar, MessageSquare } from "lucide-react";

export const revalidate = 0; // Disable caching so new messages appear immediately

export default async function MessagesPage() {
  let messages: any[] = [];
  try {
    const snapshot = await adminDb
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();

    messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Safely handle Firestore timestamps
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full pb-20 animate-fade-in">
      <div className="mb-8">
        <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">
          Inbox
        </span>
        <h1 className="text-3xl font-serif text-foreground">Reader Messages</h1>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border border-border rounded-sm p-12 text-center text-muted-foreground font-body shadow-sm">
          <MessageSquare className="w-8 h-8 mx-auto mb-4 opacity-20" />
          No messages have been received yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white border border-border rounded-sm p-6 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-border pb-4 gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-primary">{msg.name}</h3>
                  <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-sm font-sans tracking-wide text-muted-foreground hover:text-primary transition-colors mt-2">
                    <Mail className="w-4 h-4" />
                    {msg.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans tracking-wider uppercase text-muted-foreground bg-background border border-border px-4 py-2 rounded-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(msg.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
              </div>
              <p className="font-body text-foreground whitespace-pre-wrap leading-relaxed text-lg">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}