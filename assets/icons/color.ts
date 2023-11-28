const LIGHTBLUE = "#DDEBFF";
const HEAVY_BLUE = "#086AFB";
const ORANGE = "#FBB445";
const GREEN = "#0DCA9D";
const RED = "#FF7171";
const LIGHTGREY = "#F5F4F4";
const LIGHTPINK = "#FFF0F9";
const PINK = "#E7038E";
const MEDIUMGREY = "#B4B7BC";
const ACCENTBLUE = "#086AFB";
const SOFTPINK = "#FFC9E9";
const WHITE = "#FFFFFF";
const HEAVY_GREY = "#5A5A5A";
const BLACK = "#000000";

const colors = new Map();
colors.set("light-blue", LIGHTBLUE);
colors.set("orange", ORANGE);
colors.set("green", GREEN);
colors.set("red", RED);
colors.set("light-grey", LIGHTGREY);
colors.set("light-pink", LIGHTPINK);
colors.set("pink", PINK);
colors.set("medium-grey", MEDIUMGREY);
colors.set("blue", ACCENTBLUE);
colors.set("soft-pink", SOFTPINK);
colors.set("white", WHITE);
colors.set("heavy-grey", HEAVY_GREY);
colors.set("black", BLACK);
colors.set("heavy-blue", HEAVY_BLUE);

export function getColor(colorName: any) {
  if (colors.has(colorName)) {
    return colors.get(colorName);
  } else {
    return;
  }
}
