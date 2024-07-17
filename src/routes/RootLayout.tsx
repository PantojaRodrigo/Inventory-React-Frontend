import { Outlet } from "react-router-dom";
export default function RootLayout() {
  //const navigation = useNavigation();
  //{navigation.state === "loading" && <p>Loading...</p>}
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
