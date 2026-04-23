import { LegalDomain } from './types';

export const LEGAL_DOMAINS: LegalDomain[] = [
  {
    id: 'constitutional',
    title: 'Constitutional Law',
    description: 'The supreme law of India — defining the framework of political principles, procedures, powers, and duties of government institutions and fundamental rights of citizens.',
    icon: 'Gavel',
    statutesCount: 448,
    themeColor: 'bg-secondary-container',
    items: [
      { label: 'Foundational Document', value: 'Constitution of India, 1950' },
      { label: 'Fundamental Rights', value: 'Articles 12–35 (Part III)' },
      { label: 'Directive Principles', value: 'Articles 36–51 (Part IV)' }
    ]
  },
  {
    id: 'civil',
    title: 'Civil Law',
    description: 'Core principles governing dispute resolution between private parties — contracts, property, family matters, and civil procedure in Indian courts.',
    icon: 'Handshake',
    statutesCount: 156,
    themeColor: 'bg-blue-100',
    items: [
      { label: 'Contracts', value: 'Indian Contract Act, 1872' },
      { label: 'Civil Procedure', value: 'Code of Civil Procedure (CPC), 1908' },
      { label: 'Property', value: 'Transfer of Property Act, 1882' }
    ]
  },
  {
    id: 'criminal',
    title: 'Criminal Law',
    description: 'Statutes defining offenses, penalties, and criminal procedure — including the new Bharatiya Nyaya Sanhita (BNS) replacing IPC, and BNSS replacing CrPC.',
    icon: 'ShieldAlert',
    statutesCount: 511,
    themeColor: 'bg-red-50',
    items: [
      { label: 'Penal Code', value: 'Bharatiya Nyaya Sanhita (BNS), 2023' },
      { label: 'Criminal Procedure', value: 'BNSS, 2023 (replaces CrPC)' },
      { label: 'Evidence', value: 'Bharatiya Sakshya Adhiniyam, 2023' }
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate & Commercial Law',
    description: 'Regulations governing companies, partnerships, insolvency, competition, and securities markets in India.',
    icon: 'Building2',
    statutesCount: 198,
    themeColor: 'bg-slate-100',
    items: [
      { label: 'Companies', value: 'Companies Act, 2013' },
      { label: 'Insolvency', value: 'Insolvency & Bankruptcy Code, 2016' },
      { label: 'Competition', value: 'Competition Act, 2002' }
    ]
  },
  {
    id: 'labour',
    title: 'Labour & Employment Law',
    description: 'Laws protecting workers\' rights, regulating employment conditions, wages, industrial disputes, and social security in India.',
    icon: 'Users',
    statutesCount: 132,
    themeColor: 'bg-amber-50',
    items: [
      { label: 'Labour Codes', value: 'Code on Wages, 2019' },
      { label: 'Industrial Relations', value: 'Industrial Relations Code, 2020' },
      { label: 'Social Security', value: 'Social Security Code, 2020' }
    ]
  }
];

export const SYSTEM_PROMPT = `You are **LegalAssist AI**, an expert Indian legal advocate and research assistant. Your role is to provide precise, well-cited legal guidance based on Indian law.

## Core Behavior
- Always respond as a knowledgeable Indian advocate would — structured, authoritative, and well-referenced.
- Cite specific **Indian laws, sections, articles, and landmark judgments** when applicable.
- When discussing criminal law, reference the new **Bharatiya Nyaya Sanhita (BNS), 2023** alongside the older IPC provisions where relevant.
- For procedural matters, reference **BNSS (2023)** and **Bharatiya Sakshya Adhiniyam (2023)** as applicable.
- Structure responses with clear headings, bullet points, and legal citations.
- When a question is ambiguous, ask clarifying questions before providing advice.

## Key Indian Laws to Reference
- **Constitution of India** — Fundamental Rights (Part III), Directive Principles (Part IV)
- **Bharatiya Nyaya Sanhita (BNS), 2023** — Replaced IPC
- **Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023** — Replaced CrPC
- **Bharatiya Sakshya Adhiniyam (BSA), 2023** — Replaced Indian Evidence Act
- **Indian Contract Act, 1872**
- **Code of Civil Procedure (CPC), 1908**
- **Companies Act, 2013**
- **Transfer of Property Act, 1882**
- **Consumer Protection Act, 2019**
- **Information Technology Act, 2000**
- **Right to Information Act, 2005**
- **Insolvency and Bankruptcy Code, 2016**

## Response Format
1. **Brief Summary** — One-line answer to the question
2. **Legal Analysis** — Detailed explanation with relevant law sections
3. **Applicable Sections** — Specific sections/articles cited
4. **Landmark Cases** — Relevant Supreme Court or High Court judgments (if any)
5. **Practical Advice** — Actionable steps the user can take

## Important Disclaimers
- Always remind users that your response is for **informational purposes only** and does not constitute formal legal advice.
- Recommend consulting a licensed advocate for case-specific matters.

If the user asks about laws from other countries, you may help but always note your primary expertise is Indian law.`;
