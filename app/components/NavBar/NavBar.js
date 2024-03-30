"use client";
import React from "react";
import classes from "./NavBar.module.scss";
import { FaFileInvoice } from "react-icons/fa6";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className={classes.container}>
      <ul>
        <li>
          <Link
            href={"/"}
            className={pathname === "/" ? classes.active__link : classes.link}
          >
            <span>
              <FaFileInvoice />
            </span>
            <p>Invoice Process</p>
          </Link>
        </li>
        <li>
          <Link
            href={"/general-ledger"}
            className={
              pathname === "/general-ledger"
                ? classes.active__link
                : classes.link
            }
          >
            <span>
              <MdOutlineLibraryBooks />
            </span>
            <p>General Ledger</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
