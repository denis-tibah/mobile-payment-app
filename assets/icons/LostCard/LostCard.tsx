import { getColor } from "../color";
import Svg, { Path } from "react-native-svg";
export function LostCard({ size = 24, color = "pink" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 14 15"
      fill={getColor(color)}
    >
      <Path
        d="M13.4444 4.13889H11.2589C10.9089 3.53222 10.4267 3.01111 9.84333 2.61444L11.1111 1.34667L10.0144 0.25L8.32667 1.93778C7.96889 1.85222 7.60333 1.80556 7.22222 1.80556C6.84111 1.80556 6.47556 1.85222 6.12556 1.93778L4.43 0.25L3.33333 1.34667L4.59333 2.61444C4.01778 3.01111 3.53556 3.53222 3.18556 4.13889H1V5.69444H2.62556C2.58667 5.95111 2.55556 6.20778 2.55556 6.47222V7.25H1V8.80556H2.55556V9.58333C2.55556 9.84778 2.58667 10.1044 2.62556 10.3611H1V11.9167H3.18556C3.99444 13.3089 5.49556 14.25 7.22222 14.25C8.94889 14.25 10.45 13.3089 11.2589 11.9167H13.4444V10.3611H11.8189C11.8578 10.1044 11.8889 9.84778 11.8889 9.58333V8.80556H13.4444V7.25H11.8889V6.47222C11.8889 6.20778 11.8578 5.95111 11.8189 5.69444H13.4444V4.13889ZM10.3333 7.25V9.58333C10.3333 9.75445 10.31 9.94889 10.2789 10.1278L10.2011 10.6333L9.91333 11.1389C9.35333 12.1033 8.32667 12.6944 7.22222 12.6944C6.11778 12.6944 5.09111 12.0956 4.53111 11.1389L4.24333 10.6411L4.16556 10.1356C4.13444 9.95667 4.11111 9.76222 4.11111 9.58333V6.47222C4.11111 6.29333 4.13444 6.09889 4.16556 5.92778L4.24333 5.42222L4.53111 4.91667C4.76444 4.51222 5.09111 4.16222 5.47222 3.89778L5.91556 3.59444L6.49111 3.45444C6.73222 3.39222 6.98111 3.36111 7.22222 3.36111C7.47111 3.36111 7.71222 3.39222 7.96111 3.45444L8.49 3.57889L8.96444 3.90556C9.35333 4.17 9.67222 4.51222 9.90556 4.92444L10.2011 5.43L10.2789 5.93556C10.31 6.10667 10.3333 6.30111 10.3333 6.47222V7.25ZM5.66667 8.80556H8.77778V10.3611H5.66667V8.80556ZM5.66667 5.69444H8.77778V7.25H5.66667V5.69444Z"
        fill={getColor(color)}
      />
    </Svg>
  );
}
