import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="h-screen bg-cover bg-no-repeat text-center" id="error-page">
      {/* <h1 className="text-5xl">I Know You Are Looking For Water, But This Is A Desert</h1> */}
      <h1 className="text-5xl">You were not supposed to see this... Im sorry! (GG)</h1>
      <p className="text-5xl">404</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}