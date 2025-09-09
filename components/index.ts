/* 
This code is using JavaScript module exports to re-export default exports from several component files under specific names, so they can all be imported from a single place using those names.

Explanation of Syntax
Each line like export { default as NavItems } from "./NavItems"; means:

1.Import the default export from the file ./NavItems

2.Re-export it from the current file under the name NavItems
*/

export { default as NavItems } from "./NavItems";
export { default as Mobilesidebar } from "./Mobilesidebar";
export { default as Header } from "./Header";
export { default as TripCard } from "./TripCard";
export { default as StatsCard } from "./StatsCard";
export { default as InfoPill } from "./InfoPill";
