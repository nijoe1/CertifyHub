import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/outline";
type TabsWithIconProps = {
  activeTab: any; // You should replace 'any' with the actual type of your project
  handleTabChange: () => void; // You should replace 'any' with the actual type of your project
};
const TabsWithIcon: React.FC<TabsWithIconProps> = ({
  activeTab,
  handleTabChange,
}) => {
  const data = [
    {
      label: "Dashboard",
      value: "dashboard",
      icon: UserCircleIcon,
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people
      who are like offended by it, it doesn't matter.`,
    },
  ];

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      className="max-w-md mx-auto"
    >
      <TabsHeader className="mb-2">
        {data.map(({ label, value, icon }) => (
          <Tab key={value} value={value}>
            <div
              className={`flex items-center gap-2 p-2 ${
                activeTab === value ? "bg-blue-200" : ""
              }`}
            >
              {React.createElement(icon, { className: "w-5 h-5" })}
              {label}
            </div>
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

export default TabsWithIcon;
