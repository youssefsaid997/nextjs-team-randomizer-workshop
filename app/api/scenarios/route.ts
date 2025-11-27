// app/api/scenarios/seed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoDB";
import Scenario from "@/models/Scenario";

const scenarios = [
  {
    scenarioNumber: 1,
    realCompany: "Netflix",
    title: "Company A - The Physical to Digital Transformation",
    description: `Struggle:
Company A built its entire business around delivering physical media to customers. For years this model was profitable, predictable, and safe. But suddenly market behavior shifts: people want immediacy, not waiting days for deliveries.

A small competitor begins offering instant digital content via online streaming.

Customers are leaving. Infrastructure built for logistics cannot support digital delivery. Leadership is divided — some want to protect the old model, others want radical transformation.

If nothing changes, Company A will slowly die.

How to Turn It Into Success:
• Strategic Decision: pivot from physical rentals → digital platform
• Scalable Architecture: build cloud-based streaming infrastructure
• Business–IT Alignment: product, marketing, and IT must collaborate
• Data-Driven Decisions: track viewing habits, personalize content
• KPIs: measure uptime, streaming quality, user retention

Company A must decide whether to reinvent itself or disappear.`,
  },
  {
    scenarioNumber: 2,
    realCompany: "Microsoft",
    title: "Company B - The GUI Revolution Challenge",
    description: `Struggle:
Company B dominates the software market with its operating system. Businesses rely on it, developers build on it, and revenue is strong.

But one day, a competitor launches a groundbreaking graphical user interface. People love it. It is visually intuitive, interactive, and futuristic. Suddenly, Company B's once-dominant product looks outdated.

Developers start migrating. Media calls this "the future of computing."

If Company B does not act, it risks losing its entire market.

How to Turn It Into Success:
• Innovation & Continuous Learning: develop a modern, GUI-based OS
• Strategic Decision: prioritize long-term OS redesign over short-term profits
• Business–IT Alignment: unify engineering, design, and leadership
• Scalable Architecture: create a stable platform developers trust
• KPIs: adoption rate, developer engagement, system performance

This is an existential moment where innovation becomes survival.`,
  },
  {
    scenarioNumber: 3,
    realCompany: "PayPal",
    title: "Company C - The Online Payment Chaos",
    description: `Struggle:
Company C enters the online payments space with a bold idea — allow users to send money easily over the internet. But early operations are chaotic:
• Fraud is skyrocketing
• Users don't trust online payments
• Servers crash under load
• Every competitor is burning money faster
• No one knows which product feature to focus on

The company is growing, but it is unsustainable and dangerous.

Without a strategic pivot, failure is guaranteed.

How to Turn It Into Success:
• Strategic Decision-Making: focus on one core use case that users love
• IT Governance & Risk Management: build strong anti-fraud systems
• Innovation: create the first scalable digital payment infrastructure
• Scalability: redesign architecture to handle millions of transactions
• KPIs: fraud rate, transaction success rate, user growth, churn

Turning chaos into a stable financial platform is the challenge.`,
  },
  {
    scenarioNumber: 4,
    realCompany: "MySpace",
    title: "Company D - The Scale Crisis",
    description: `Struggle:
Company D becomes the world's fastest-growing social platform. Users join by the millions. But the success hides a fatal weakness: the system was never designed for this scale.
• Servers overload
• Frequent outages
• Slow loading times
• Poor code quality
• Data loss incidents
• No governance or rules for deployments

Meanwhile, a smaller competitor launches a more stable, clean, and user-friendly service. Users begin silently migrating.

Company D faces a full collapse due to internal IT weaknesses — not competition.

How to Turn It Into Success:
• Scalable IT Architecture: redesign backend for reliability
• Governance: enforce rules, testing, deployment standards
• Business–IT Alignment: unify product growth with tech capacity
• KPIs: uptime, latency, error rates, user retention
• Continuous Learning: train engineers, modernize systems

This is a battle against internal chaos — not the market.`,
  },
  {
    scenarioNumber: 5,
    realCompany: "Sun Microsystems",
    title: "Company E - The Innovation Without Strategy",
    description: `Struggle:
Company E is respected for creating advanced enterprise technologies — servers, operating systems, programming languages. Technically, you are one of the best.

But the business is failing.
• High R&D cost
• No monetization plan for great innovations
• Fragmented products
• Competitors offering cheaper alternatives
• Leadership disagreement
• Market shifts towards cloud computing

You have world-class technology but no unified strategy.

How to Turn It Into Success:
• Strategic Focus: choose which products to prioritize
• Business–IT Alignment: align engineering efforts with business value
• Innovation: invest in cloud early instead of fragmented projects
• IT Governance: structure R&D investment and product lifecycle
• KPIs: R&D costs vs revenue, product profitability, customer adoption

Company E must choose a direction — or risk collapse.`,
  },
  {
    scenarioNumber: 6,
    realCompany: "Avast",
    title: "Company F - The Cybersecurity Disruption",
    description: `Struggle:
Company F is a small cybersecurity company competing against giant global players. Competitors have massive budgets, worldwide distribution, and enormous threat intelligence networks.

Users are frustrated with slow, expensive antivirus software, but they don't trust small companies either.

Meanwhile, global cyber threats are growing faster than ever.

Company F wants to disrupt the market — but the challenge is enormous.

How to Turn It Into Success:
• Innovative Business Model: adopt freemium to acquire millions of users
• Scalable Architecture: build cloud-based scanning and updates
• Risk Management: fight threats with real-time intelligence
• Data-Driven Decisions: use user data to improve detection
• KPIs: threat detection speed, user growth, false positives, churn

A radically new strategy can turn Company F into a global cybersecurity leader.`,
  },
  {
    scenarioNumber: 7,
    realCompany: "Seznam.cz",
    title: "Company G - The Local vs Global Giant",
    description: `Struggle:
Company G is a local search engine that has dominated its home market for years. Users trust it, advertisers rely on it, and the platform is deeply integrated with local services.

Then a global tech giant enters the market — armed with:
• a superior global search algorithm
• unlimited server infrastructure
• strong advertising technology
• global brand recognition
• a huge ecosystem (maps, browser, email, mobile OS)

In every other country, this giant destroys local competitors.

Now, Company G is under existential threat.

How to Turn It Into Success:
• Strategic Decision: dominate the local market through localization
• IT Architecture: maintain low-latency local data centers for speed
• Business–IT Alignment: integrate search with news, email, maps, and videos
• Continuous Learning: keep improving Czech-language algorithms
• KPIs: search quality, local ranking performance, ecosystem engagement

The question: Can Company G survive by knowing its users better than the global competitor knows the world?`,
  },
];

export async function POST(request: Request) {
  try {
    await connectDB();

    // Check if scenarios already exist
    const existingCount = await Scenario.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          error: "Scenarios already seeded",
          count: existingCount,
        },
        { status: 400 }
      );
    }

    // Insert all scenarios
    const result = await Scenario.insertMany(scenarios);

    return NextResponse.json(
      {
        success: true,
        message: "Scenarios seeded successfully",
        count: result.length,
        scenarios: result.map((s) => ({
          id: s._id,
          scenarioNumber: s.scenarioNumber,
          realCompany: s.realCompany,
          title: s.title,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed scenarios" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const scenarios = await Scenario.find({});

   return NextResponse.json({ scenarios }, { status: 200 });
  } catch (error) {}
}

// Optional: DELETE route to reset scenarios
export async function DELETE(request: Request) {
  try {
    await connectDB();

    await Scenario.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "All scenarios deleted",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete scenarios" },
      { status: 500 }
    );
  }
}
