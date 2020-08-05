import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import ErrorBoundary from "./Loader/ErrorBoundary";
import Animation from "./Loader/Animation";
import { routes } from "../router";
import { withRouter } from "react-router-dom";

const ContentRoutes = () => {
  return (
    <div className="col">
      <ErrorBoundary>
        <Suspense fallback={<Animation />}>
          <Switch>
            {routes.map((route, i) => (
              <Route
                path={route.path}
                key={`route-${i}`}
                render={(props) => <route.component {...props} />}
              />
            ))}
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default withRouter(ContentRoutes);
