export type Property = {
  id: string
  title: string
  slug: string
  description: string
  listing_type: "sale" | "rent" | "lease" | "pg" | "commercial_sale" | "commercial_rent"
  property_type: string
  status: string
  approval_status: "pending" | "approved" | "rejected" | "published"
  price: number
  rent_amount?: number
  area: number
  bedrooms: number
  bathrooms: number
  city: string
  locality: string
  state: string
  furnished: string
  amenities: string[]
  images: string[]
  is_featured: boolean
  is_verified: boolean
  verification: { identity_verified: boolean; kyc_verified: boolean; rera_available: boolean }
  floor?: string
  parking?: string
  possession?: string
  owner: { name: string; avatar: string; verified: boolean }
  created_at: string
}

export const mockProperties: Property[] = [
  {
    id: "1", title: "Luxury 3BHK Sea-Facing Apartment in Worli", slug: "luxury-3bhk-worli-mumbai",
    description: "Premium sea-facing apartment with panoramic Arabian Sea views, Italian marble flooring and smart home automation.",
    listing_type: "sale", property_type: "Apartment", status: "published", approval_status: "approved",
    price: 48500000, area: 1850, bedrooms: 3, bathrooms: 3, city: "Mumbai", locality: "Worli", state: "Maharashtra",
    furnished: "Semi-Furnished", amenities: ["Pool","Gym","Lift","Security","Parking"], 
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"],
    is_featured: true, is_verified: true, verification:{identity_verified:true,kyc_verified:true,rera_available:true},
    floor:"12th", parking:"2 Covered", possession:"Ready to Move", owner:{name:"Rajesh Builders", avatar:"https://i.pravatar.cc/100?img=12", verified:true}, created_at:"2026-08-15"
  },
  {
    id: "2", title: "4BHK Independent Villa with Garden - Whitefield", slug: "4bhk-villa-whitefield-bangalore",
    description: "Spacious villa in gated community with private garden, modular kitchen and terrace sit-out.",
    listing_type: "sale", property_type: "Villa", status: "published", approval_status: "approved",
    price: 32500000, area: 3200, bedrooms: 4, bathrooms: 4, city: "Bengaluru", locality: "Whitefield", state:"Karnataka",
    furnished:"Unfurnished", amenities:["Garden","Parking","Security","Club House"],
    images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"],
    is_featured:true, is_verified:true, verification:{identity_verified:true,kyc_verified:true,rera_available:true},
    floor:"G+1", parking:"3", possession:"Ready to Move", owner:{name:"Prestige Group", avatar:"https://i.pravatar.cc/100?img=8", verified:true}, created_at:"2026-08-10"
  },
  {
    id:"3", title:"2BHK High-Rise in Golf Course Road - Gurgaon", slug:"2bhk-golf-course-road-gurgaon",
    description:"Modern 2BHK with city view, premium amenities and excellent connectivity to Cyber City.",
    listing_type:"rent", property_type:"Apartment", status:"published", approval_status:"approved",
    price:65000, rent_amount:65000, area:1250, bedrooms:2, bathrooms:2, city:"Gurugram", locality:"Golf Course Road", state:"Haryana",
    furnished:"Fully Furnished", amenities:["Gym","Pool","Security","Power Backup"],
    images:["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], is_featured:true, is_verified:true,
    verification:{identity_verified:true,kyc_verified:false,rera_available:false}, floor:"18th", parking:"1", possession:"Immediate", owner:{name:"Amit Sharma", avatar:"https://i.pravatar.cc/100?img=15", verified:true}, created_at:"2026-08-20"
  },
  {
    id:"4", title:"Commercial Office Space - Connaught Place", slug:"office-connaught-place-delhi",
    description:"Grade A office space in CP with central AC, reception and meeting rooms.",
    listing_type:"commercial_rent", property_type:"Office", status:"published", approval_status:"approved",
    price:250000, rent_amount:250000, area:2800, bedrooms:0, bathrooms:3, city:"New Delhi", locality:"Connaught Place", state:"Delhi",
    furnished:"Furnished", amenities:["Lift","AC","Security","Parking"], images:["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"],
    is_featured:true, is_verified:true, verification:{identity_verified:true,kyc_verified:true,rera_available:false}, floor:"5th", parking:"4", possession:"Immediate", owner:{name:"DLF Commercial", avatar:"https://i.pravatar.cc/100?img=20", verified:true}, created_at:"2026-08-18"
  },
  {
    id:"5", title:"3BHK Premium Apartment - Baner Pune", slug:"3bhk-baner-pune",
    description:"Vastu compliant 3BHK with balcony garden and premium fittings near Mumbai-Bangalore highway.",
    listing_type:"sale", property_type:"Apartment", status:"published", approval_status:"approved",
    price:18500000, area:1550, bedrooms:3, bathrooms:3, city:"Pune", locality:"Baner", state:"Maharashtra",
    furnished:"Semi-Furnished", amenities:["Gym","Pool","Garden"], images:["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],
    is_featured:false, is_verified:true, verification:{identity_verified:true,kyc_verified:true,rera_available:true}, floor:"8th", parking:"2", possession:"Dec 2026", owner:{name:"Venkatesh Overseas", avatar:"https://i.pravatar.cc/100?img=11", verified:false}, created_at:"2026-08-12"
  },
  {
    id:"6", title:"1RK Co-Living PG - HSR Layout", slug:"pg-hsr-layout-bangalore",
    description:"Fully furnished PG with food, WiFi and housekeeping for working professionals.",
    listing_type:"pg", property_type:"PG", status:"published", approval_status:"approved",
    price:15000, rent_amount:15000, area:350, bedrooms:1, bathrooms:1, city:"Bengaluru", locality:"HSR Layout", state:"Karnataka",
    furnished:"Fully Furnished", amenities:["WiFi","Food","AC","Laundry"], images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    is_featured:false, is_verified:false, verification:{identity_verified:false,kyc_verified:false,rera_available:false}, floor:"2nd", parking:"0", possession:"Immediate", owner:{name:"Stanza Living", avatar:"https://i.pravatar.cc/100?img=33", verified:true}, created_at:"2026-08-22"
  },
  {
    id:"7", title:"Plot for Sale - Hinjewadi Phase 2", slug:"plot-hinjewadi-pune",
    description:"NA plot with clear title, gated community, ready for construction.",
    listing_type:"sale", property_type:"Plot", status:"published", approval_status:"approved",
    price:9500000, area:1800, bedrooms:0, bathrooms:0, city:"Pune", locality:"Hinjewadi", state:"Maharashtra",
    furnished:"Unfurnished", amenities:["Security","Water","Electricity"], images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    is_featured:false, is_verified:true, verification:{identity_verified:true,kyc_verified:true,rera_available:true}, floor:"Ground", parking:"-", possession:"Immediate", owner:{name:"Rohan Builders", avatar:"https://i.pravatar.cc/100?img=14", verified:true}, created_at:"2026-08-08"
  },
  {
    id:"8", title:"Warehouse for Lease - Bhiwandi", slug:"warehouse-bhiwandi-mumbai",
    description:"25000 sqft warehouse with loading bay and office cabin near NH.",
    listing_type:"lease", property_type:"Warehouse", status:"published", approval_status:"approved",
    price:180000, rent_amount:180000, area:25000, bedrooms:0, bathrooms:2, city:"Mumbai", locality:"Bhiwandi", state:"Maharashtra",
    furnished:"Unfurnished", amenities:["Security","Parking","Power Backup"], images:["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"],
    is_featured:false, is_verified:true, verification:{identity_verified:true,kyc_verified:true,rera_available:false}, floor:"Ground", parking:"10+", possession:"Immediate", owner:{name:"Indospace", avatar:"https://i.pravatar.cc/100?img=22", verified:true}, created_at:"2026-08-05"
  },
]

export const heroSlides = [
  {
    id:"1",
    title:"Discover Properties.\nConnect With Professionals.",
    subtitle:"India's most trusted real-estate marketplace — Verification Before Transaction.",
    desktop_image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600",
    mobile_image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    cta_text:"Explore Properties", cta_url:"/buy", display_order:1, is_active:true
  },
  {
    id:"2",
    title:"Your Dream Home\nAwaits in Mumbai",
    subtitle:"5000+ verified listings • RERA approved projects • Expert guidance at every step.",
    desktop_image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600",
    mobile_image:"https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
    cta_text:"View Mumbai Homes", cta_url:"/buy?city=Mumbai", display_order:2, is_active:true
  },
  {
    id:"3",
    title:"Commercial Spaces\nThat Grow Business",
    subtitle:"Offices, shops & warehouses in prime locations — leased to Fortune 500 companies.",
    desktop_image:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600",
    mobile_image:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    cta_text:"Explore Commercial", cta_url:"/commercial", display_order:3, is_active:true
  },
]

export const cities = [
  { name:"Mumbai", state:"Maharashtra", count:1243, image:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600" },
  { name:"Bengaluru", state:"Karnataka", count:982, image:"https://images.unsplash.com/photo-1596178060810-4742e9c4ffc6?w=600" },
  { name:"Delhi NCR", state:"Delhi", count:2104, image:"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600" },
  { name:"Pune", state:"Maharashtra", count:867, image:"https://images.unsplash.com/photo-1524634126442-357e5eac3c14?w=600" },
  { name:"Hyderabad", state:"Telangana", count:743, image:"https://images.unsplash.com/photo-1570129477492-45c003edb2be?w=600" },
  { name:"Chennai", state:"Tamil Nadu", count:521, image:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600" },
]

export const categories = [
  { label:"Apartments", icon:"🏢", count:"12k+", type:"Apartment" },
  { label:"Villas", icon:"🏡", count:"3.2k+", type:"Villa" },
  { label:"Plots", icon:"🌿", count:"5k+", type:"Plot" },
  { label:"Commercial", icon:"🏬", count:"2.1k+", type:"Office" },
  { label:"PG / Co-Living", icon:"🛏️", count:"1.8k+", type:"PG" },
  { label:"New Projects", icon:"🏗️", count:"420+", type:"New Project" },
]

export const blogPosts = [
  { id:"1", slug:"rera-guide-2026", title:"RERA 2026: What Every Buyer Must Verify Before Paying", excerpt:"Complete checklist for RERA verification, title search and payment safety.", image:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", category:"Legal", date:"Aug 20, 2026", author:"Adv. Priya Menon" },
  { id:"2", slug:"mumbai-market-report", title:"Mumbai Market Report: Where Prices Will Move Next", excerpt:"Data-driven analysis of MMR micro-markets and where smart money is headed.", image:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600", category:"Market Insights", date:"Aug 18, 2026", author:"Rahul Desai" },
  { id:"3", slug:"home-loan-tips", title:"Home Loan Approval: 7 Documents That Speed Up Your Sanction", excerpt:"Avoid rejection with this bank-verified documentation guide.", image:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", category:"Finance", date:"Aug 15, 2026", author:"Neha Kapoor" },
]

export const agents = [
  { name:"Aarav Mehta", city:"Mumbai", deals:142, rating:4.9, image:"https://i.pravatar.cc/200?img=12", verified:true, phone:"+91 98201 33445" },
  { name:"Sneha Reddy", city:"Hyderabad", deals:98, rating:4.8, image:"https://i.pravatar.cc/200?img=32", verified:true, phone:"+91 90001 22334" },
  { name:"Vikram Singh", city:"Delhi", deals:210, rating:4.9, image:"https://i.pravatar.cc/200?img=15", verified:true, phone:"+91 98111 55667" },
]

export const testimonials = [
  { name:"Ananya & Rohan", text:"Found our 3BHK in Pune within 9 days. Verification badges saved us from a fake listing.", location:"Pune", rating:5 },
  { name:"Karan Patel", text:"As an NRI, the RERA centre and legal guidance helped me invest safely from Dubai.", location:"Dubai → Mumbai", rating:5 },
  { name:"Sunita Devi", text:"Partner program helped me earn ₹2.3L last quarter referring clients. Payouts are on time.", location:"Channel Partner, Delhi", rating:5 },
]
