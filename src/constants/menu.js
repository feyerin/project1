
const data = [
  {
  id: "dashboards",
  icon: "iconsminds-shop",
  label: "Dashboards",
  to: "/app/dashboards/start",
},
{
  id: "merchant",
  icon: "iconsminds-shop-4",
  label: "menu.merchant",
  to: "/app/merchant",
  subs: [
    {
      icon: "simple-icon-check",
      label: "menu.approval",
      to: "/app/merchant/approval-merchant"
    },
    {
    icon: "simple-icon-hourglass",
    label: "menu.merchant",
    to: "/app/merchant/merchant",
    subs: [
      {
        icon: "iconsminds-record",
        label: "Merchant PKP",
        to: "/app/merchant/merchant"
      },
      {
        icon: "iconsminds-record",
        label: "Merchant non-PKP",
        to: "/app/merchant/merchant-non-pkp"
      },
    ]
    },
  ]
},
{
  id: "sembako",
  icon: "simple-icon-briefcase",
  label: "Sembako",
  to: "/app/sembako",
  subs: [
    {
      icon: "iconsminds-record",
      label: "Incoming Order",
      to: "/app/sembako/incoming-order",
    },
    {
      icon: "iconsminds-record",
      label: "Monitoring",
      to: "/app/sembako/monitoring-order",
    },
    {
      icon: "iconsminds-record",
      label: "Market",
      to: "/app/sembako/list-market",
    },
    {
      icon: "iconsminds-record",
      label: "Dedicated Driver",
      to: "/app/sembako/dedicated-driver",
    },
  ]
},
{
  icon: "simple-icon-speedometer",
  label: "Driver",
  to: "/app/driver/driver-merchant"
},
// {
//   id: "docs",
//   icon: "iconsminds-library",
//   label: "menu.docs",
//   to: "https://piaf-vue-docs.coloredstrategies.com/",
//   newWindow: true
// }
];
export default data;