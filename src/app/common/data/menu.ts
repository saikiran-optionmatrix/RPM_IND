import { Menu } from '../models/menu.model';

export const applicationMenuItems: Menu[] = [

  new Menu(1, 'Dashboard', '/dashboard', null, 'dashboard', null, false, 0),

  new Menu(10, 'Projects', '/projects', null, 'business_center', null, false, 0),

  new Menu(20, 'Stages', '/stages', null, 'layers', null, false, 0),

  new Menu(30, 'Gates', '/gates', null, 'door_front', null, false, 0),

  new Menu(40, 'Master Data', '/master-data', null, 'view_list', null, false, 0),

  new Menu(50, 'Monitor', '/monitor', null, 'groups', null, false, 0),

  new Menu(60, 'Hours', '/hours', null, 'access_time', null, false, 0),
    new Menu(70, 'Resources', '/resources', null, 'groups', null, false, 0)

];

export const verticalMenuItems = applicationMenuItems;

export const horizontalMenuItems = applicationMenuItems;
