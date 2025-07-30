"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
}

const articles: Article[] = [
  {
    id: "understanding-common-gst-notices",
    title: "Understanding Common GST Notices: A Complete Guide",
    excerpt: "Learn about different types of GST notices and how to respond effectively to avoid penalties.",
    content: `# Understanding Common GST Notices: A Complete Guide

The Goods and Services Tax (GST) regime issues several types of notices to taxpayers. Understanding these notices and responding appropriately is crucial for maintaining compliance.

## Types of GST Notices

### 1. GSTR-3A – Non-filing Notice
This notice is issued when you miss filing your monthly or quarterly returns. The key points to remember:
- File the pending return immediately
- Pay applicable late fees
- Provide a valid reason for the delay

### 2. ASMT-10 – Assessment Notice
Issued when the tax officer identifies discrepancies in your returns:
- Review the discrepancy mentioned
- Gather supporting documents
- Provide detailed reconciliation statements
- Respond within the stipulated time frame

### 3. DRC-01 – Demand Notice
This is a formal demand for additional tax liability:
- Carefully review the demand
- Check calculation accuracy
- File appropriate response with supporting evidence
- Consider pre-deposit if required

## Best Practices for Notice Response

1. **Never ignore a notice** - This can lead to adverse orders
2. **Respond within time limits** - Usually 15-30 days
3. **Maintain proper documentation** - Keep all supporting documents ready
4. **Seek professional help** - When in doubt, consult a tax expert

## Conclusion

Proper understanding and timely response to GST notices can save you from penalties and legal complications. Always maintain good compliance practices to minimize notice issuance.`,
    author: "CA Priya Sharma",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "GST Compliance",
  },
  {
    id: "msme-guide-to-timely-filing",
    title: "The MSME Guide to Timely GST Filing",
    excerpt: "Essential tips and strategies for MSMEs to maintain timely GST compliance and avoid penalties.",
    content: `# The MSME Guide to Timely GST Filing

For Micro, Small, and Medium Enterprises (MSMEs), maintaining timely GST compliance is crucial for business continuity and avoiding penalties.

## Why Timely Filing Matters

Late filing penalties can quickly add up:
- ₹50 per day per return (CGST + SGST)
- Interest on delayed tax payments
- Potential blocking of input tax credit

## Setting Up Your Compliance Calendar

### Monthly Deadlines
- **GSTR-1**: 11th of following month
- **GSTR-3B**: 20th of following month
- **GSTR-2A**: Auto-populated

### Quarterly Deadlines (for eligible taxpayers)
- **GSTR-1**: 13th of month following quarter
- **GSTR-3B**: 22nd/24th of month following quarter

## Automation Strategies

1. **Use compliance software** like Legal Eagle
2. **Set up calendar reminders** 3 days before deadlines
3. **Automate data collection** from your accounting system
4. **Regular reconciliation** of books with GST returns

## Common Filing Mistakes to Avoid

- Incorrect GSTIN of suppliers
- Wrong HSN/SAC codes
- Mismatched invoice dates
- Incomplete address details

## Conclusion

Consistent, timely filing is the foundation of good GST compliance. Invest in the right tools and processes to make it effortless.`,
    author: "Rajesh Kumar",
    date: "2025-01-10",
    readTime: "6 min read",
    category: "Filing Guide",
  },
  {
    id: "when-to-hire-a-chartered-accountant",
    title: "When Should MSMEs Hire a Chartered Accountant?",
    excerpt: "Understand the right time to engage a CA for your GST compliance needs and what to look for.",
    content: `# When Should MSMEs Hire a Chartered Accountant?

As your business grows, the complexity of GST compliance increases. Here's when you should consider hiring a Chartered Accountant (CA).

## Signs You Need a CA

### Revenue Thresholds
- Turnover exceeding ₹5 crores
- Multiple state registrations
- Complex business operations

### Compliance Complexity
- Receiving more than 3 notices per quarter
- Input credit spanning 4+ states
- Export-import operations
- Multiple business verticals

## What to Look for in a GST CA

### Technical Expertise
- GST certification and training
- Experience with your industry
- Knowledge of latest amendments
- Technology adoption

### Service Quality
- Proactive communication
- Timely filing track record
- Advisory services beyond compliance
- Reasonable fee structure

## Cost-Benefit Analysis

### CA Fees vs. Penalties
- Average CA fees: ₹15,000-50,000 annually
- Penalty for late filing: ₹18,000+ annually
- Notice response costs: ₹5,000-25,000 per notice

### DIY vs. Professional Help
Consider your:
- Time investment
- Compliance accuracy
- Peace of mind
- Business focus

## Hybrid Approach

Many successful MSMEs use a combination:
- CA for complex matters and annual compliance
- Software like Legal Eagle for routine filings
- In-house team for day-to-day operations

## Conclusion

The decision to hire a CA should be based on your business complexity, compliance track record, and growth plans. Sometimes, a good compliance software can bridge the gap effectively.`,
    author: "Meera Patel",
    date: "2025-01-05",
    readTime: "7 min read",
    category: "Professional Services",
  },
]

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "GST Compliance":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Filing Guide":
        return "bg-green-100 text-green-800 border-green-200"
      case "Professional Services":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (selectedArticle) {
    return (
      <section className="py-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <Button variant="outline" onClick={() => setSelectedArticle(null)} className="mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to Articles
          </Button>

          <article className="prose prose-lg max-w-none">
            <div className="mb-8">
              <Badge className={getCategoryColor(selectedArticle.category)}>{selectedArticle.category}</Badge>
              <h1 className="text-4xl font-bold mt-4 mb-4 text-primary font-inter">{selectedArticle.title}</h1>
              <div className="flex items-center gap-6 text-text-secondary text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(selectedArticle.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>
            </div>

            <div
              className="font-lora leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: selectedArticle.content
                  .replace(/^# /gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-primary font-inter">')
                  .replace(/^## /gm, '<h2 class="text-2xl font-semibold mt-6 mb-3 text-primary font-inter">')
                  .replace(/^### /gm, '<h3 class="text-xl font-semibold mt-4 mb-2 text-primary font-inter">')
                  .replace(/^\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
                  .replace(/^\*(.*?)\*/gm, "<em>$1</em>")
                  .replace(/^- /gm, "<li>")
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/^(.+)$/gm, "<p>$1</p>"),
              }}
            />
          </article>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-inter">Insights & Guides</h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-lora">
            Expert insights on GST compliance, filing strategies, and business growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                  <span className="text-sm text-text-secondary">{article.readTime}</span>
                </div>
                <CardTitle className="text-xl font-inter hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary font-lora mb-4 leading-relaxed">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(article.date)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
