import React from "react";
import * as FiIcons from "react-icons/fi";
import * as MdIcons from "react-icons/md";
import * as IO5icons from "react-icons/io5";
import * as Bsicons from "react-icons/bs";

export const SideBarData = () => [
  {
    title: "Profile",
    path: "/profile",
    icon: <MdIcons.MdOutlinePerson />,
    cName: "nav-text",
  },

  {
    title: "Home",
    icon: <IO5icons.IoHome />,
    path: "/user-feed",
    cName: "nav-text",
  },

  {
    title: "Journal",
    icon: <Bsicons.BsJournalPlus />,
    path: "/journal-entry",
    cName: "nav-text",
  },

  {
    title: "Journal-Entries",
    icon: <Bsicons.BsFillJournalBookmarkFill />,
    path: "/all-journal-entries",
    cName: "nav-text",
  },

  {
    title: "Mood & Activities",
    icon: <Bsicons.BsActivity />,
    path: "/mood-and-activities",
    cName: "nav-text",
  },

  {
    title: "LogOut",
    icon: <FiIcons.FiLogOut />,
    path: "/logout",
    cName: "nav-text",
  },
];
