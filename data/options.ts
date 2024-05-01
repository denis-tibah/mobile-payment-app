export const registrationPhonePrefix = [
  /* null, */
  { label: "+44 UK", value: "+44" }, // UK
  { label: "+353 IRE", value: "+353" }, // Ireland
  { label: "+34 SPN", value: "+34" }, //  Spain
  { label: "+357 CYPR", value: "+357" }, //  Cyprus
  { label: "+49 GER", value: "+49" }, // Germany
  { label: "+33 FRAN", value: "+33" }, // France
  { label: "+356 MLTA", value: "+356" }, // Malta
  { label: "+370 LITH", value: "+370" }, // Lithuania
  { label: "+372 EST", value: "+372" }, //  Estonia
  { label: "+39 ITLY", value: "+39" }, // Italy
  { label: "+30 GRC", value: "+30" }, // Greece
  { label: "+90 TRKY", value: "+90" }, // Turkey
  { label: "+32 BELG", value: "+32" }, // Belgium
  { label: "+54 ARG", value: "+54" }, // Argentina
  { label: "+63 PHIL", value: "+63" }, // Philippines
];

export const salutations = [
  /* null, */
  { label: "Mr", value: "Mr" },
  { label: "Ms", value: "Ms" },
  { label: "Mrs", value: "Mrs" },
];

export const salutations2 = [
  { key: "Mr", value: "Mr" },
  { key: "Ms", value: "Ms" },
  { key: "Mrs", value: "Mrs" },
];

export const noOfMonths = [
  null,
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
export const noOfMonthsObj = [
  { label: "0 month", value: 0 },
  { label: "1 month", value: 1 },
  { label: "2 months", value: 2 },
  { label: "3 months", value: 3 },
  { label: "4 months", value: 4 },
  { label: "5 months", value: 5 },
  { label: "6 months", value: 6 },
  { label: "7 months", value: 7 },
  { label: "8 months", value: 8 },
  { label: "9 months", value: 9 },
  { label: "10 months", value: 10 },
  { label: "11 months", value: 11 },
  { label: "12 months", value: 12 },
];
export const noOfYears = [null, "1", "2", "3"];
export const noOfYearsObj = [
  { label: "1 year", value: 1 },
  { label: "2 years", value: 2 },
  { label: "3 years", value: 3 },
];

export const sourceOfWealth = [
  /* null, */
  { label: "Salary", value: "salary" },
  { label: "Dividend", value: "dividend" },
  { label: "Crypto", value: "crypto" },
];

export const sourceOfWealthTwo = [
  /* null, */
  { key: "Salary", value: "Salary" },
  { key: "Dividend", value: "Dividend" },
  { key: "Crypto", value: "Crypto" },
];

export const paymentReasons = [
  { label: "Send to Beneficiary", value: "send_to_beneficiary" },
  { label: "Send to External", value: "send_to_external" },
];

export const employmentStatus = [
  /* null, */
  { label: "Employed", value: "employed" },
  { label: "Self Employed", value: "self_employed" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Student", value: "student" },
  { label: "Retired", value: "retired" },
];

export const employmentStatusTwo = [
  /* null, */
  { key: "Employed", value: "Employed", passedValue: "employed" },
  {
    key: "Self Employed",
    value: "Self Employed",
    passedValue: "self_employed",
  },
  { key: "Unemployed", value: "Unemployed", passedValue: "unemployed" },
  { key: "Student", value: "Student", passedValue: "student" },
  { key: "Retired", value: "Retired", passedValue: "retired" },
];

export const companyDetailsRole = [
  {
    label: "Executive Director",
    value: "executive_director",
  },
  {
    label: "Secretary",
    value: "secretary",
  },
  {
    label: "Non-Executive",
    value: "non_executive",
  },
];

export const companyIndustry = [
  { label: "Gaming", value: "gaming" },
  { label: "Crypto", value: "crypto" },
  { label: "Shipping", value: "" },
  { label: "Forex", value: "forex" },
  { label: "Online Sales", value: "online_sales" },
  { label: "Fintech", value: "fintech" },
];

export const companyType = [
  {
    label: "Private company limited by shares or Ltd.",
    value: "private_company_limited_by_shares_or_ltd",
  },
  { label: "Public limited company", value: "public_limited_company" },
  { label: "Limited partnership", value: "limited_partnership" },
  { label: "General partnership", value: "general_partnership" },
  { label: "Chartered company", value: "chartered_company" },
  { label: "Statutory corporation", value: "statutory_corporation" },
  { label: "State-owned enterprise", value: "state_owned_enterprise" },
  { label: "Holding company", value: "holding_company" },
  { label: "Subsidiary company", value: "subsidiary_company" },
  { label: "Sole proprietorship", value: "sole_proprietorship" },
  {
    label: "Charitable incorporated organisation",
    value: "charitable_incorporated_organisation",
  },
];

export const getCardCurrencies = [
  // { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  // { label: "GBP", value: "GBP" },
];

export const sex = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export const documentType = [
  // { label: "Drivers license", value: 0 },
  { label: "ID card", value: 1 },
  { label: "Passport", value: 2 },
  // { label: "Residence permit", value: 3 },
];

export const countries = [
  { label: "Argentina", value: "ARG" },
  { label: "United Kingdom", value: "UK" },
  { label: "Spain", value: "ESP" },
  { label: "Netherlands", value: "NLD" },
];

export const ticketType = [
  { label: "Technical", value: "technical" },
  { label: "Access", value: "access" },
  { label: "Payment", value: "payment" },
  {
    label: "Beneficiary",
    value: "beneficiary",
  },
  { label: "Card", value: "card" },
  { label: "Profile", value: "profile" },
  {
    label: "Transactions",
    value: "transactions",
  },
];

export const ticketTypeTwo = [
  { key: "Technical", value: "technical" },
  { key: "Access", value: "access" },
  { key: "Payment", value: "payment" },
  {
    key: "Beneficiary",
    value: "beneficiary",
  },
  { key: "Card", value: "card" },
  { key: "Profile", value: "profile" },
  {
    key: "Transactions",
    value: "transactions",
  },
];
