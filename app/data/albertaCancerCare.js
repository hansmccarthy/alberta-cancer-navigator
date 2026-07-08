// Curated, source-cited data for Alberta Cancer Navigator.
// Every fact here is traceable to an Alberta Health Services (AHS) /
// Cancer Care Alberta page via a `sources` link. Nothing is invented, and
// no diagnosis-specific routing is asserted (there is no citable public
// source for that) — the chosen cancer type is used to search clinical trials.
// Verified against live AHS pages in July 2026.

// Common cancer types for the dropdown. `condQuery` is the term sent to the
// clinicaltrials.gov API. Labels use plain, grade-7 language.
export const CANCER_TYPES = [
  { value: "breast", label: "Breast", condQuery: "breast cancer" },
  { value: "lung", label: "Lung", condQuery: "lung cancer" },
  {
    value: "colorectal",
    label: "Colon or rectum (colorectal)",
    condQuery: "colorectal cancer",
  },
  { value: "prostate", label: "Prostate", condQuery: "prostate cancer" },
  { value: "bladder", label: "Bladder", condQuery: "bladder cancer" },
  { value: "kidney", label: "Kidney", condQuery: "kidney cancer" },
  { value: "melanoma", label: "Skin (melanoma)", condQuery: "melanoma" },
  {
    value: "lymphoma",
    label: "Lymph nodes (lymphoma)",
    condQuery: "lymphoma",
  },
  { value: "leukemia", label: "Blood (leukemia)", condQuery: "leukemia" },
  {
    value: "myeloma",
    label: "Bone marrow (multiple myeloma)",
    condQuery: "multiple myeloma",
  },
  { value: "pancreatic", label: "Pancreas", condQuery: "pancreatic cancer" },
  { value: "liver", label: "Liver", condQuery: "liver cancer" },
  { value: "stomach", label: "Stomach", condQuery: "stomach cancer" },
  {
    value: "esophageal",
    label: "Food pipe (esophagus)",
    condQuery: "esophageal cancer",
  },
  { value: "ovarian", label: "Ovary", condQuery: "ovarian cancer" },
  {
    value: "uterine",
    label: "Uterus (endometrial)",
    condQuery: "endometrial cancer",
  },
  { value: "cervical", label: "Cervix", condQuery: "cervical cancer" },
  {
    value: "headneck",
    label: "Head and neck",
    condQuery: "head and neck cancer",
  },
  { value: "brain", label: "Brain", condQuery: "brain cancer" },
  { value: "thyroid", label: "Thyroid", condQuery: "thyroid cancer" },
];

// The four Alberta areas the app asks about.
export const ZONES = [
  { value: "edmonton-north", label: "Edmonton / North" },
  { value: "calgary-south", label: "Calgary / South" },
  { value: "central", label: "Central" },
  { value: "other", label: "Other" },
];

// The AHS location search that clinicaltrials.gov results are filtered to.
export const CLINICAL_TRIALS_LOCATION = "Alberta Canada";

// Which cancer centre serves each area. Names, cities, and source links are
// all from AHS / Cancer Care Alberta pages.
export const CENTRES_BY_ZONE = {
  "edmonton-north": {
    primary: {
      name: "Cross Cancer Institute",
      city: "Edmonton",
      tier: "Main cancer centre (full specialist care)",
    },
    others: [
      { name: "Grande Prairie Cancer Centre", city: "Grande Prairie" },
    ],
    note:
      "For most people in the Edmonton and North area, the Cross Cancer Institute in Edmonton is the main cancer centre. Some care is also given closer to home at regional and community centres.",
    sources: [
      {
        label: "Cross Cancer Institute (AHS)",
        url: "https://www.albertahealthservices.ca/findhealth/facility.aspx?id=6122",
      },
      {
        label: "Our Cancer Centres (AHS)",
        url: "https://www.albertahealthservices.ca/info/Page14723.aspx",
      },
    ],
  },
  "calgary-south": {
    primary: {
      name: "Arthur J.E. Child Comprehensive Cancer Centre",
      city: "Calgary",
      tier: "Main cancer centre (full specialist care)",
    },
    others: [
      { name: "Jack Ady Cancer Centre", city: "Lethbridge" },
      { name: "Margery E. Yuill Cancer Centre", city: "Medicine Hat" },
    ],
    note:
      "For most people in the Calgary and South area, the Arthur J.E. Child Comprehensive Cancer Centre in Calgary is the main cancer centre. It took over cancer care from the Tom Baker Cancer Centre in late 2024. Some care is also given closer to home in Lethbridge and Medicine Hat.",
    sources: [
      {
        label: "Arthur J.E. Child Comprehensive Cancer Centre (AHS)",
        url: "https://www.albertahealthservices.ca/ajec/page15399.aspx",
      },
      {
        label: "Move from Tom Baker to Arthur Child (AHS)",
        url: "https://www.albertahealthservices.ca/news/Page18603.aspx",
      },
    ],
  },
  central: {
    primary: {
      name: "Central Alberta Cancer Centre",
      city: "Red Deer",
      tier: "Regional cancer centre",
    },
    others: [],
    note:
      "For most people in the Central area, the Central Alberta Cancer Centre in Red Deer is the main cancer centre. Some kinds of care may still be given at the Cross Cancer Institute in Edmonton or the Arthur J.E. Child centre in Calgary.",
    sources: [
      {
        label: "Central Alberta Cancer Centre (AHS)",
        url: "https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1048870",
      },
      {
        label: "Our Cancer Centres (AHS)",
        url: "https://www.albertahealthservices.ca/info/Page14723.aspx",
      },
    ],
  },
  other: {
    primary: null,
    others: [],
    note:
      "Alberta has 17 cancer centres. Many towns have a community cancer centre that gives some care close to home. Use the AHS list below to find the centre nearest you, and ask your care team where your treatment will happen.",
    sources: [
      {
        label: "Our Cancer Centres — full list (AHS)",
        url: "https://www.albertahealthservices.ca/info/Page14723.aspx",
      },
      {
        label: "Cancer Care Alberta home (AHS)",
        url: "https://www.albertahealthservices.ca/cancer/cancer.aspx",
      },
    ],
  },
};

// General, source-cited explanation of how a cancer referral works in Alberta.
export const REFERRAL_INFO = {
  text: [
    "Your family doctor or another doctor usually sends a referral to a cancer centre. In some cases you can also refer yourself.",
    "Your family doctor stays part of your care the whole way through. They get updates about your diagnosis, treatment, and follow-up.",
    "If you are not sure what happens next, ask your doctor or call the cancer centre for your area.",
  ],
  sources: [
    {
      label: "Cancer Diagnosis Work-up & Referral (AHS)",
      url: "https://www.albertahealthservices.ca/cancer/Page18298.aspx",
    },
    {
      label: "Cancer Care Alberta home (AHS)",
      url: "https://www.albertahealthservices.ca/cancer/cancer.aspx",
    },
  ],
};

// Helpers so the API route and page share the same lookup logic.
export function getCancerType(value) {
  return CANCER_TYPES.find((t) => t.value === value) || null;
}

export function getCentreForZone(zone) {
  return CENTRES_BY_ZONE[zone] || null;
}
