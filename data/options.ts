export const registrationPhonePrefix = [
  null,
  { label: "+44", value: "+44" }, // UK
  { label: "+353", value: "+353" }, // Ireland
  { label: "+34", value: "+34" }, //  Spain
  { label: "+357", value: "+357" }, //  Cyprus
  { label: "+49", value: "+49" }, // Germany
  { label: "+33", value: "+33" }, // France
  { label: "+356", value: "+356" }, // Malta
  { label: "+370", value: "+370" }, // Lithuania
  { label: "+372", value: "+372" }, //  Estonia
  { label: "+39", value: "+39" }, // Italy
  { label: "+30", value: "+30" }, // Greece
  { label: "+90", value: "+90" }, // Turkey
  { label: "+32", value: "+32" }, // Belguim
  { label: "+54", value: "+54" }, // Argentina
];

export const salutations = [
  null,
  { label: "Mr", value: "Mr" },
  { label: "Ms", value: "Ms" },
  { label: "Mrs", value: "Mrs" },
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
export const noOfYears = [null, "1", "2", "3"];

export const sourceOfWealth = [
  null,
  { label: "Salary", value: "salary" },
  { label: "Dividend", value: "dividend" },
  { label: "Crypto", value: "crypto" },
];

export const paymentReasons = [
  { label: "Send to Beneficiary", value: "send_to_beneficiary" },
  { label: "Send to External", value: "send_to_external" },
];

export const employmentStatus = [
  null,
  { label: "Employed", value: "employed" },
  { label: "Self Employed", value: "self_employed" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Student", value: "student" },
  { label: "Retired", value: "retired" },
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
