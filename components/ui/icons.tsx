import React from 'react';
import { Feather, FontAwesome, Ionicons, MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';

const mapProps = (props: any) => ({ size: props.size ?? 20, color: props.color ?? '#000', style: props.style });

export const Search = (props: any) => <Feather name="search" {...mapProps(props)} />;
export const User = (props: any) => <FontAwesome name="user" {...mapProps(props)} />;
export const Heart = (props: any) => <Ionicons name="heart" {...mapProps(props)} />;
export const Menu = (props: any) => <MaterialIcons name="menu" {...mapProps(props)} />;
export const X = (props: any) => <MaterialIcons name="close" {...mapProps(props)} />;
export const ArrowLeft = (props: any) => <Feather name="arrow-left" {...mapProps(props)} />;
export const ArrowRight = (props: any) => <Feather name="arrow-right" {...mapProps(props)} />;
export const ChevronLeft = (props: any) => <Feather name="chevron-left" {...mapProps(props)} />;
export const ChevronRight = (props: any) => <Feather name="chevron-right" {...mapProps(props)} />;
export const ChevronDown = (props: any) => <Feather name="chevron-down" {...mapProps(props)} />;
export const Play = (props: any) => <MaterialIcons name="play-arrow" {...mapProps(props)} />;
export const Star = (props: any) => <FontAwesome name="star" {...mapProps(props)} />;
export const Trash2 = (props: any) => <Feather name="trash-2" {...mapProps(props)} />;
export const Edit = (props: any) => <Feather name="edit" {...mapProps(props)} />;
export const Plus = (props: any) => <Feather name="plus" {...mapProps(props)} />;
export const Film = (props: any) => <MaterialIcons name="movie" {...mapProps(props)} />;
export const Users = (props: any) => <FontAwesome name="users" {...mapProps(props)} />;
export const ImageIcon = (props: any) => <Feather name="image" {...mapProps(props)} />;
export const Info = (props: any) => <Feather name="info" {...mapProps(props)} />;
export const Clock = (props: any) => <Feather name="clock" {...mapProps(props)} />;
export const Mail = (props: any) => <Feather name="mail" {...mapProps(props)} />;
export const Lock = (props: any) => <Feather name="lock" {...mapProps(props)} />;
export const Camera = (props: any) => <Feather name="camera" {...mapProps(props)} />;
export const Save = (props: any) => <Feather name="save" {...mapProps(props)} />;
export const LogOut = (props: any) => <Feather name="log-out" {...mapProps(props)} />;
export const Shield = (props: any) => <Feather name="shield" {...mapProps(props)} />;
export const Check = (props: any) => <Feather name="check" {...mapProps(props)} />;
export const Circle = (props: any) => <Entypo name="circle" {...mapProps(props)} />;
export const MoreHorizontal = (props: any) => <Feather name="more-horizontal" {...mapProps(props)} />;
export const Dot = (props: any) => <Entypo name="dot-single" {...mapProps(props)} />;

export default {
  Search,
  User,
  Heart,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Star,
  Trash2,
  Edit,
  Plus,
  Film,
  Users,
  ImageIcon,
  Info,
  Clock,
  Mail,
  Lock,
  Camera,
  Save,
  LogOut,
  Shield,
  Check,
  Circle,
  MoreHorizontal,
  Dot,
};
