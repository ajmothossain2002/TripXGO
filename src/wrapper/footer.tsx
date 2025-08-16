import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-4 text-center text-sm text-gray-500 border-t">
      © {new Date().getFullYear()} Travel Co. All rights reserved.
    </footer>
  );
};

export default Footer;
