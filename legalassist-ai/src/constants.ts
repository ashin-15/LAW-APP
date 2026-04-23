/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalDomain } from './types';

export const LEGAL_DOMAINS: LegalDomain[] = [
  {
    id: 'constitutional',
    title: 'Constitutional Law',
    description: 'The body of law which defines the role, powers, and structure of different entities within a state, namely, the executive, the parliament or legislature, and the judiciary.',
    icon: 'Gavel',
    statutesCount: 124,
    themeColor: 'bg-secondary-container',
    items: [
      { label: 'Foundational Document', value: 'The Constitution' },
      { label: 'Landmark Act', value: 'Civil Rights Act of 1964' }
    ]
  },
  {
    id: 'civil',
    title: 'Civil Law',
    description: 'Core principles governing dispute resolution between private parties, including contracts, torts, and property disputes.',
    icon: 'Handshake',
    statutesCount: 85,
    themeColor: 'bg-blue-100',
    items: [
      { label: 'UCC', value: 'Uniform Commercial Code' },
      { label: 'Torts', value: 'Restatement (Second)' }
    ]
  },
  {
    id: 'criminal',
    title: 'Criminal Law',
    description: 'Statutes defining offenses against the state, corresponding penalties, and rules of criminal procedure.',
    icon: 'ShieldAlert',
    statutesCount: 210,
    themeColor: 'bg-red-50',
    items: [
      { label: 'MPC', value: 'Model Penal Code' },
      { label: 'Federal', value: 'Title 18, U.S. Code' }
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate Law',
    description: 'Regulations governing the rights, relations, and conduct of businesses, companies, and organizations.',
    icon: 'Building2',
    statutesCount: 156,
    themeColor: 'bg-slate-100',
    items: [
      { label: 'Delaware', value: 'General Corp. Law' },
      { label: 'Securities', value: 'Securities Act of 1933' }
    ]
  }
];
