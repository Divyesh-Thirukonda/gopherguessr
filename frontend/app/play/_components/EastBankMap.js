import dynamic from "next/dynamic";

const BaseMap = dynamic(() => import("./BaseMap"), { ssr: false });

export default function EastBankMap({ loc }) {
  return (
    <BaseMap
      imgSrc="/images/eastbank.png"
      bounds={[
        [44.97069111915625, -93.23820422738942],
        [44.97837130687424, -93.22659538730979],
      ]}
      loc={loc}
    />
  );
}
