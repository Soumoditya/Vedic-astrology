"use client";

import { useMemo, useState } from "react";

const TOPIC_OPTIONS = [
  "Full chart reading",
  "Career",
  "Marriage / relationship",
  "Finance / wealth",
  "Family / home",
  "Education",
  "Health / lifestyle",
  "Other"
];

const PLAN_OPTIONS = [
  { id: "full", label: "Full chart reading", price: 1500, note: "Deep analysis across life areas" },
  { id: "topic1", label: "Single topic", price: 500, note: "One focused issue" },
  { id: "topic2", label: "Two topics", price: 1000, note: "Any two focused issues" }
];

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState(PLAN_OPTIONS[0].id);
  const [selectedTopics, setSelectedTopics] = useState([TOPIC_OPTIONS[0]]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState("");

  const amount = useMemo(() => {
    const plan = PLAN_OPTIONS.find((p) => p.id === selectedPlan) || PLAN_OPTIONS[0];
    return plan.price;
  }, [selectedPlan]);

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      reddit: String(fd.get("reddit") || "").trim(),
      name: String(fd.get("name") || "").trim(),
      birthDate: String(fd.get("birthDate") || "").trim(),
      birthTime: String(fd.get("birthTime") || "").trim(),
      gender: String(fd.get("gender") || "").trim(),
      birthPlace: String(fd.get("birthPlace") || "").trim(),
      plan: selectedPlan,
      amount,
      topics: selectedTopics,
      context: String(fd.get("context") || "").trim(),
      utr: String(fd.get("utr") || "").trim(),
      comments: String(fd.get("comments") || "").trim()
    };

    if (!payload.reddit || !payload.birthDate || !payload.birthTime || !payload.birthPlace || !payload.utr) {
      setStatus("error");
      setMessage("Reddit username, birth date, birth time, birth place, and UTR are required.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.error || "Submission failed");

      setBookingId(data.bookingId || "");
      setStatus("success");
      setMessage("Booking submitted. You can now verify payment and continue the reading on Reddit DM.");
      form.reset();
      setSelectedPlan(PLAN_OPTIONS[0].id);
      setSelectedTopics([TOPIC_OPTIONS[0]]);
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Something went wrong.");
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.glow1} />
      <div style={styles.glow2} />
      <section style={styles.hero}>
        <div style={styles.badge}>Private Vedic consultations</div>
        <h1 style={styles.h1}>Anonymous premium astrology booking</h1>
        <p style={styles.lead}>
          Readings delivered through Reddit DM. No personal branding, no fake claims, no clutter.
        </p>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Pricing</div>
            <div style={styles.priceRow}><span>Full chart reading</span><strong>₹1500</strong></div>
            <div style={styles.priceRow}><span>Single topic</span><strong>₹500</strong></div>
            <div style={styles.priceRow}><span>Two topics</span><strong>₹1000</strong></div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Delivery</div>
            <div style={styles.points}>Reddit username required</div>
            <div style={styles.points}>Birth details + context captured</div>
            <div style={styles.points}>Manual UPI verification workflow</div>
          </div>
        </div>
      </section>

      <section style={styles.formCard}>
        <div style={styles.formHeader}>
          <h2 style={styles.h2}>Book a reading</h2>
          <p style={styles.subtle}>Fill the form, pay by UPI, enter the UTR, and submit.</p>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.twoCol}>
            <Field name="reddit" label="Reddit username *" placeholder="u/yourname" />
            <Field name="name" label="Name" placeholder="Optional" />
          </div>

          <div style={styles.twoCol}>
            <Field name="birthDate" label="Birth date *" type="date" />
            <Field name="birthTime" label="Exact birth time *" type="time" />
          </div>

          <div style={styles.twoCol}>
            <Field name="birthPlace" label="Birth place *" placeholder="City, state, country" />
            <label style={styles.label}>
              Gender
              <select name="gender" style={styles.input} defaultValue="Prefer not to say">
                <option>Prefer not to say</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div style={styles.block}>
            <label style={styles.label}>Plan</label>
            <div style={styles.planGrid}>
              {PLAN_OPTIONS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    ...styles.plan,
                    borderColor: selectedPlan === plan.id ? "#d8b46d" : "rgba(255,255,255,0.12)",
                    transform: selectedPlan === plan.id ? "translateY(-2px)" : "none"
                  }}
                >
                  <strong>{plan.label}</strong>
                  <span>{plan.note}</span>
                  <em>₹{plan.price}</em>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.block}>
            <label style={styles.label}>Topic(s)</label>
            <div style={styles.topicGrid}>
              {TOPIC_OPTIONS.map((topic) => {
                const active = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setSelectedTopics((prev) => prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]);
                    }}
                    style={{
                      ...styles.topic,
                      background: active ? "rgba(216,180,109,0.18)" : "rgba(255,255,255,0.03)",
                      borderColor: active ? "#d8b46d" : "rgba(255,255,255,0.12)"
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          <Field name="context" label="Context / situation" textarea placeholder="Add the details that matter for analysis." />

          <div style={styles.payBox}>
            <div>
              <div style={styles.payLabel}>UPI payment</div>
              <div style={styles.upi}>soumodityapramanik-2@okaxis</div>
              <div style={styles.subtle}>Bank: Airtel Payments Bank</div>
            </div>
            <div style={styles.amount}>Amount: ₹{amount}</div>
          </div>

          <div style={styles.twoCol}>
            <Field name="utr" label="UTR / reference ID *" placeholder="Transaction reference" />
            <Field name="comments" label="Extra comments" placeholder="Optional feedback" />
          </div>

          <button type="submit" style={styles.submit} disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting..." : "Submit booking"}
          </button>

          {message ? (
            <div style={{ ...styles.notice, ...(status === "success" ? styles.success : styles.error) }}>
              {message}
              {bookingId ? <div style={styles.bookingId}>Booking ID: {bookingId}</div> : null}
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}

function Field({ name, label, placeholder, type = "text", textarea = false }) {
  return (
    <label style={styles.label}>
      {label}
      {textarea ? (
        <textarea name={name} placeholder={placeholder} rows={5} style={{ ...styles.input, resize: "vertical" }} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} style={styles.input} />
      )}
    </label>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px 20px 56px",
    color: "#f7f2e8",
    background:
      "radial-gradient(circle at top, rgba(216,180,109,0.18), transparent 28%), linear-gradient(180deg, #050608 0%, #0b0d12 52%, #0a0a0a 100%)",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  glow1: {
    position: "absolute",
    inset: "-120px auto auto -80px",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "rgba(216,180,109,0.16)",
    filter: "blur(90px)"
  },
  glow2: {
    position: "absolute",
    inset: "auto -100px 60px auto",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    filter: "blur(100px)"
  },
  hero: {
    maxWidth: 1120,
    margin: "0 auto 28px",
    position: "relative",
    zIndex: 1
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid rgba(216,180,109,0.28)",
    background: "rgba(216,180,109,0.08)",
    padding: "10px 14px",
    borderRadius: 999,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#d8b46d",
    marginBottom: 18
  },
  h1: {
    margin: 0,
    fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
    lineHeight: 0.96,
    maxWidth: 820,
    letterSpacing: -1.6
  },
  lead: {
    maxWidth: 760,
    color: "rgba(247,242,232,0.72)",
    fontSize: "1.02rem",
    lineHeight: 1.7,
    marginTop: 16,
    marginBottom: 26
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16
  },
  card: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(10,12,16,0.76)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
  },
  cardTitle: {
    color: "#d8b46d",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
    marginBottom: 14
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  points: {
    padding: "10px 0",
    color: "rgba(247,242,232,0.82)"
  },
  formCard: {
    maxWidth: 1120,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(8,10,14,0.82)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 25px 80px rgba(0,0,0,0.42)"
  },
  formHeader: { marginBottom: 18 },
  h2: { margin: 0, fontSize: "1.9rem" },
  subtle: { color: "rgba(247,242,232,0.64)", marginTop: 6, fontSize: 14 },
  form: { display: "grid", gap: 16 },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16
  },
  block: {
    display: "grid",
    gap: 10
  },
  label: {
    display: "grid",
    gap: 8,
    fontSize: 14,
    color: "rgba(247,242,232,0.86)"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    color: "#f7f2e8",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: "14px 15px",
    outline: "none",
    fontSize: 15
  },
  planGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12
  },
  plan: {
    textAlign: "left",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    padding: 16,
    display: "grid",
    gap: 8,
    transition: "transform 160ms ease, border-color 160ms ease"
  },
  topicGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10
  },
  topic: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#f7f2e8",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.03)"
  },
  payBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    borderRadius: 20,
    border: "1px solid rgba(216,180,109,0.28)",
    background: "linear-gradient(135deg, rgba(216,180,109,0.12), rgba(255,255,255,0.03))",
    padding: 18
  },
  payLabel: { color: "#d8b46d", textTransform: "uppercase", fontSize: 12, letterSpacing: 1 },
  upi: { fontSize: "1.1rem", fontWeight: 700, marginTop: 6 },
  amount: { fontSize: "1.1rem", fontWeight: 700, color: "#d8b46d" },
  submit: {
    border: "none",
    borderRadius: 18,
    padding: "16px 18px",
    background: "linear-gradient(135deg, #d8b46d, #f5d99a)",
    color: "#111",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer"
  },
  notice: {
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    lineHeight: 1.6
  },
  success: {
    background: "rgba(24, 88, 42, 0.35)",
    color: "#d6ffd9"
  },
  error: {
    background: "rgba(96, 24, 24, 0.34)",
    color: "#ffd6d6"
  },
  bookingId: { marginTop: 8, opacity: 0.85, fontSize: 13 }
};
