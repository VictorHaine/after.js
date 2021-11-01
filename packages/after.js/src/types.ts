import {
  RouteProps,
  RouteComponentProps,
  match as Match,
} from 'react-router-dom';
import { HelmetData } from 'react-helmet';
import { Request, Response } from 'express';
import { History, Location } from 'history';
import { Document as DefaultDoc } from './Document';

export interface CtxBase {
  req?: Request;
  res?: Response;
  history?: History;
  location?: Location;
  scrollToTop?: ScrollToTop;
}

export interface Ctx<P> extends CtxBase {
  match: Match<P>;
}

export interface AsyncComponent {
  getInitialProps: (props: Ctx<any>) => any;
  load?: () => Promise<React.ReactNode>;
  getChunkName: () => string | undefined;
}

export type AsyncRouteComponentType<Props> = React.ComponentType<Props> &
  AsyncComponent;

/**
 * this type handles the component type in the route config object
 * {
 *   path: "/",
 *   exact: true,
 *   component: ReactComponent <- AsyncRouteableComponent
 * }
 */
export type AsyncRouteableComponent<Props = any> =
  // re-exported from react-router (RouteComponentProps)
  | React.ComponentType<RouteComponentProps<Props>>
  | React.ComponentType<Props>
  // After.js Page Component (getInitialProps and ...)
  | AsyncRouteComponentType<RouteComponentProps<Props>>
  | AsyncRouteComponentType<Props>;

export interface AsyncRouteComponentState {
  Component: AsyncRouteableComponent | null;
}

export interface AsyncRouteProps<Props = any> extends RouteProps {
  path?: string;
  Placeholder?: React.ComponentType<any>;
  component: AsyncRouteableComponent<Props>;
  redirectTo?: string;
}

export type ScrollToTop = React.RefObject<boolean>;

// result of getInitalProps
export type InitialData = Promise<unknown>[];

export interface ServerAppState {
  afterData: AfterClientData;
  initialData: InitialData;
}

export interface InitialProps {
  match?: AsyncRouteProps;
  data: InitialData;
}

export interface AfterClientData {
  scrollToTop: ScrollToTop;
  ssg?: boolean;
}

// <AfterData /> will send this object
export interface ServerAppState {
  afterData: AfterClientData;
  initialData: InitialData;
}

// result of the render()
export interface RenderResult {
  html: string;
  redirect: string;
  statusCode: number;
  data: InitialData;
}

// special result of getInitialProps
export interface RedirectWithStatuCode {
  statusCode?: number;
  redirectTo?: string;
}

// renderApp()
export interface AfterRenderAppOptions<T> {
  req: Request;
  res: Response;
  assets: Assets;
  routes: AsyncRouteProps[];
  document?: typeof DefaultDoc;
  chunks: Chunks;
  scrollToTop?: boolean;
  ssg?: boolean;
  customRenderer?: (
    element: React.ReactElement<T>
  ) => { html: string } | Promise<{ html: string }>;
}

// render()
export type AfterRenderOptions<T> = Omit<AfterRenderAppOptions<T>, 'ssg'>;

// renderStatic()
export type AfterRenderStaticOptions<T> = Omit<AfterRenderAppOptions<T>, 'ssg'>;

// Result of Document
export interface RenderPageResult {
  html: string;
  helmet: HelmetData;
}

// TransitionBehavior
export type TransitionBehavior = 'blocking' | 'instant';

// Document.js
export interface DocumentgetInitialProps<T = RenderPageResult> {
  req: Request;
  res: Response;
  helmet: HelmetData;
  assets: Assets;
  data: ServerAppState;
  renderPage: () => Promise<T>;
  match: Match | null;
  scripts: string[];
  styles: string[];
  scrollToTop: ScrollToTop;
}

export type DocumentProps<T = RenderPageResult> = Omit<
  DocumentgetInitialProps<T>,
  'req' | 'res' | 'renderPage' | 'scrollToTop'
> &
  T;
export type AfterContext = DocumentProps;

// getAssets utility function
export interface GetAssetsParams {
  chunks: Chunks;
  route?: AsyncRouteProps<any>;
}

// ES Module type
export type Module<P> =
  | {
      default?: P;
      [x: string]: any;
    }
  | {
      exports?: P;
      [x: string]: any;
    };

// assets.json that generated by razzle
export interface Assets {
  [name: string]: {
    [ext: string]: string;
  };
}

// chunks.json that generated by razzle
export interface Chunks {
  [key: string]: {
    css: string[];
    js: string[];
  };
}
