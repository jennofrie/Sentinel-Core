/**
 * Type declarations for react-simple-maps
 * Created to fix TypeScript build errors when types package is not available
 */

declare module "react-simple-maps" {
  import { ReactNode, CSSProperties } from "react";

  export interface GeoJsonProperties {
    [key: string]: any;
  }

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    precision?: number;
  }

  export interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string | ((...args: any[]) => any);
    projectionConfig?: ProjectionConfig;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography?: string | object | any[];
    children?: (data: {
      geographies: any[];
      path: (geography: any) => string;
      projection: any;
    }) => ReactNode;
  }

  export interface GeographyStyle {
    default?: CSSProperties;
    hover?: CSSProperties;
    pressed?: CSSProperties;
  }

  export interface GeographyProps {
    geography?: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: CSSProperties | GeographyStyle | ((geography: any) => CSSProperties | GeographyStyle);
    className?: string;
    onMouseEnter?: (event: any, geography: any) => void;
    onMouseLeave?: (event: any, geography: any) => void;
    onClick?: (event: any, geography: any) => void;
  }

  export interface MarkerProps {
    coordinates?: [number, number];
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export interface LineProps {
    from?: [number, number];
    to?: [number, number];
    coordinates?: [number, number][];
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel";
    opacity?: number;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    filterZoomEvent?: (event: any) => boolean;
    onMoveStart?: () => void;
    onMoveEnd?: () => void;
    style?: CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Line: React.FC<LineProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;

  export default ComposableMap;
}

