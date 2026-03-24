import React from 'react';
import { Feather, FontAwesome, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
const mapProps = (props) => ({ size: props.size ?? 20, color: props.color ?? '#000', style: props.style });
export const Search = (props) => <Feather name="search" {...mapProps(props)}/>;
export const User = (props) => <FontAwesome name="user" {...mapProps(props)}/>;
export const Heart = (props) => <Ionicons name="heart" {...mapProps(props)}/>;
export const Menu = (props) => <MaterialIcons name="menu" {...mapProps(props)}/>;
export const X = (props) => <MaterialIcons name="close" {...mapProps(props)}/>;
export const ArrowLeft = (props) => <Feather name="arrow-left" {...mapProps(props)}/>;
export const ArrowRight = (props) => <Feather name="arrow-right" {...mapProps(props)}/>;
export const ChevronLeft = (props) => <Feather name="chevron-left" {...mapProps(props)}/>;
export const ChevronRight = (props) => <Feather name="chevron-right" {...mapProps(props)}/>;
export const ChevronDown = (props) => <Feather name="chevron-down" {...mapProps(props)}/>;
export const Play = (props) => <MaterialIcons name="play-arrow" {...mapProps(props)}/>;
export const Star = (props) => <FontAwesome name="star" {...mapProps(props)}/>;
export const Trash2 = (props) => <Feather name="trash-2" {...mapProps(props)}/>;
export const Edit = (props) => <Feather name="edit" {...mapProps(props)}/>;
export const Plus = (props) => <Feather name="plus" {...mapProps(props)}/>;
export const Film = (props) => <MaterialIcons name="movie" {...mapProps(props)}/>;
export const Users = (props) => <FontAwesome name="users" {...mapProps(props)}/>;
export const ImageIcon = (props) => <Feather name="image" {...mapProps(props)}/>;
export const Info = (props) => <Feather name="info" {...mapProps(props)}/>;
export const Clock = (props) => <Feather name="clock" {...mapProps(props)}/>;
export const Mail = (props) => <Feather name="mail" {...mapProps(props)}/>;
export const Lock = (props) => <Feather name="lock" {...mapProps(props)}/>;
export const Camera = (props) => <Feather name="camera" {...mapProps(props)}/>;
export const Save = (props) => <Feather name="save" {...mapProps(props)}/>;
export const LogOut = (props) => <Feather name="log-out" {...mapProps(props)}/>;
export const Shield = (props) => <Feather name="shield" {...mapProps(props)}/>;
export const Check = (props) => <Feather name="check" {...mapProps(props)}/>;
export const Circle = (props) => <Entypo name="circle" {...mapProps(props)}/>;
export const MoreHorizontal = (props) => <Feather name="more-horizontal" {...mapProps(props)}/>;
export const Dot = (props) => <Entypo name="dot-single" {...mapProps(props)}/>;
export const MessageSquare = (props) => <Feather name="message-square" {...mapProps(props)}/>;
export const Folder = (props) => <Feather name="folder" {...mapProps(props)}/>;
export const AlertTriangle = (props) => <Feather name="alert-triangle" {...mapProps(props)}/>;
export const BarChart2 = (props) => <Feather name="bar-chart-2" {...mapProps(props)}/>;
export const Lightbulb = (props) => <Feather name="zap" {...mapProps(props)}/>;
export const Flame = (props) => <Feather name="activity" {...mapProps(props)}/>;
export const Monitor = (props) => <Feather name="monitor" {...mapProps(props)}/>;
export const Sparkles = (props) => <Feather name="star" {...mapProps(props)}/>;
export const Radio = (props) => <Feather name="radio" {...mapProps(props)}/>;
export const Eye = (props) => <Feather name="eye" {...mapProps(props)}/>;
export const EyeOff = (props) => <Feather name="eye-off" {...mapProps(props)}/>;
export const Tag = (props) => <Feather name="tag" {...mapProps(props)}/>;
export const Globe = (props) => <Feather name="globe" {...mapProps(props)}/>;
export const HomeIcon = (props) => <Feather name="home" {...mapProps(props)}/>;
export const EmptyHeart = (props) => <Feather name="heart" {...mapProps(props)}/>;
export const CheckCircle = (props) => <Feather name="check-circle" {...mapProps(props)}/>;

export const Refresh = (props) => <Feather name="refresh-cw" {...mapProps(props)}/>;

export const Calendar = (props) => <Feather name="calendar" {...mapProps(props)}/>;

export default {
    Search, User, Heart, Menu, X, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Play, Star, Trash2, Edit, Plus, Film, Users, ImageIcon, Info, Clock, Mail, Lock, Camera, Save, LogOut, Shield, Check, Circle, MoreHorizontal, Dot,
    MessageSquare, Folder, AlertTriangle, BarChart2, Lightbulb, Flame, Monitor, Sparkles, Radio, Eye, EyeOff, Tag, Globe, HomeIcon, EmptyHeart, CheckCircle, Refresh, Calendar
};



