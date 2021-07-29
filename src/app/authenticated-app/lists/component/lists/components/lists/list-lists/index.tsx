import React, { MouseEvent, useLayoutEffect, useState } from 'react';
import { SimpleGrid, Box, Icon, Stack, Tooltip, useDisclosure } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { Button, Select } from 'app/components';
import { icons } from 'feather-icons';
import { ListItemMenu } from '../../../../../components/list-item-menu';
import { List, SmartList } from '../../../../../lists.types';
import { DeleteAllConfirmationDialog } from '../../../../../components/delete-all-confirmation-modal';
import { useSelector } from 'react-redux';
import { selectActiveSubscription } from '../../../../../../settings';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

interface ItemProps {
  history: any;
  showMenu: Function;
  active?: boolean;
  is_smart: boolean;
  is_favorite: boolean;
  is_trash?: boolean;
  is_initial?: boolean;
  locked?: boolean;
}

const GridItem = (props: ItemProps & List) => {
  let icon = props.icon && icons[props.icon] ? props.icon : 'database';
  if (props.is_initial) {
    icon = 'user';
  }

  const handleClick = () => {
    if (props.is_trash) return;
    if (props.is_smart) props.history.push(`/s/lists/view/${props.id}/smart`);
    else props.history.push(`/s/lists/view/${props.id}`);
  };

  return (
    <Box
      title={props.name}
      className="list-item--grid"
      opacity={props.locked ? 0.2 : 1}
      cursor={props.locked ? 'not-allowed !important' : 'pointer'}
      onClick={() => {
        if (!props.locked) {
          handleClick();
        }
      }}
    >
      <Box
        className="box"
        bg={
          props.is_initial
            ? '#3525E6'
            : props.is_smart
            ? '#02AAA4'
            : props.color || 'rgba(15,15,15, 0.8)'
        }
      >
        <img
          alt="list-icon"
          src={`data:image/svg+xml;utf8,${icons[icon].toSvg({
            color: 'white',
          })}`}
        />
        {!props.is_initial && (
          <div
            id={`list-${props.id}`}
            className="action-btn-bg"
            onClick={(event: MouseEvent) => {
              event.stopPropagation();
              if (!props.locked) {
                props.showMenu(event);
              }
            }}
          >
            <Icon name="chevron-down" color="white" size="14px" />
          </div>
        )}
      </Box>
      <div className="label">
        {props.is_favorite && (
          <Icon
            name="star"
            marginRight="3px"
            size="10px"
            style={{
              color: 'rgba(233,168,0,0.8)',
            }}
          />
        )}

        <Box
          overflow="hidden"
          // @ts-ignore
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {props.name}
        </Box>
      </div>
      {props.is_initial && (
        <Box
          fontSize="10px"
          color="#32a852"
          textAlign="center"
          alignSelf="center"
          backgroundColor="rgba(50, 168, 82, 0.2)"
          borderRadius="5px"
          padding="2px 5px"
          mt="5px"
          width="fit-content"
          marginX="auto"
        >
          primary
        </Box>
      )}
    </Box>
  );
};

const ListItem = (props: ItemProps & List) => {
  let icon = props.icon && icons[props.icon] ? props.icon : 'database';
  if (props.is_initial) {
    icon = 'user';
  }

  const handleClick = () => {
    if (props.is_trash) return;
    if (props.is_smart) props.history.push(`/s/lists/view/${props.id}/smart`);
    else props.history.push(`/s/lists/view/${props.id}`);
  };

  return (
    <Box
      title={props.name}
      className={`list-item--list ${props.active && 'active'}`}
      opacity={props.locked ? 0.2 : 1}
      cursor={props.locked ? 'not-allowed !important' : 'pointer'}
      onClick={() => {
        if (!props.locked) {
          handleClick();
        }
      }}
    >
      <Box display="flex" alignItems="center">
        <Box
          className="box"
          bg={
            props.is_initial
              ? '#3525E6'
              : props.is_smart
              ? '#02AAA4'
              : props.color || 'rgba(15,15,15, 0.8)'
          }
        >
          <img
            alt="list-icon"
            src={`data:image/svg+xml;utf8,${icons[icon].toSvg({
              color: 'white',
            })}`}
          />
        </Box>
        <div className="label">
          {props.is_favorite && (
            <Icon
              name="star"
              marginRight="3px"
              size="10px"
              style={{
                color: 'rgba(233,168,0,0.8)',
              }}
            />
          )}
          <Box
            overflow="hidden"
            whiteSpace="nowrap"
            // @ts-ignore
            textOverflow="ellipsis"
            maxWidth="250px"
          >
            {props.name}
          </Box>
        </div>
      </Box>
      {props.is_initial && (
        <Box
          fontSize="10px"
          color="#32a852"
          textAlign="center"
          alignSelf="center"
          backgroundColor="rgba(50, 168, 82, 0.2)"
          borderRadius="5px"
          padding="2px 5px"
          width="fit-content"
          marginLeft="10px"
        >
          primary
        </Box>
      )}
      {!props.is_initial && (
        <div
          className="action-btn-bg"
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            if (!props.locked) {
              props.showMenu(event);
            }
          }}
        >
          <Icon name="chevron-down" color="white" size="14px" />
        </div>
      )}
    </Box>
  );
};

const AddButtonGrid = (props: any) => (
  <div className="add-button--grid" onClick={props.onClick}>
    <div className="box">
      <img
        alt="list-icon"
        src={`data:image/svg+xml;utf8,${icons['plus'].toSvg({ color: 'grey' })}`}
      />
    </div>
    <div className="label">Add a list</div>
  </div>
);

const AddButtonList = (props: any) => (
  <div className="add-button--list" onClick={props.onClick}>
    <Box display="flex" alignItems="center">
      <div className="box">
        <img
          alt="list-icon"
          src={`data:image/svg+xml;utf8,${icons['plus'].toSvg({ color: 'grey' })}`}
        />
      </div>
      <div className="label">Add a list</div>
    </Box>
  </div>
);

interface Props {
  lists: List[];
  smart_lists: SmartList[];
  favorite_lists: List[];
  trash_lists: List[];
  favorites: string[];
  openCreateTableModal: Function;
  searchValue: string;
  visualization: string;
  updateList: Function;
  deleteList: Function;
  restoreList: Function;
  deleteListPermanently: Function;
  deleteSmartList: Function;
  updateSmartList: Function;
  markListFavorite: Function;
  unMarkListFavorite: Function;
  selectedTab: string;
  selectTab: Function;
  initial_list: string;
  openNoSubscriptionModal: Function;
  deleteTrashPermanently: Function;
}

const filterOptions: { key: string; label: string }[] = [
  {
    key: 'lists',
    label: 'Lists',
  },
  {
    key: 'favorites',
    label: 'Favorites',
  },
  {
    key: 'trash',
    label: 'Trash',
  },
];

export const Component = (props: Props) => {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedSmartList, setSelectedSmartList] = useState<SmartList | null>(null);
  const [selectedTrashList, setSelectedTrashList] = useState<List | null>(null);
  const [selectedItemPosition, setSelectedItemPosition] = useState({
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  });

  const {
    isOpen: isDeleteAllTrashDialogOpen,
    onOpen: openDeleteAllTrashDialog,
    onClose: closeDeleteAllTrashDialog,
  } = useDisclosure();

  const {
    lists,
    initial_list,
    smart_lists,
    favorite_lists,
    trash_lists,
    searchValue,
    visualization,
    updateList,
    deleteList,
    deleteListPermanently,
    restoreList,
    deleteSmartList,
    updateSmartList,
    selectedTab,
    selectTab,
    markListFavorite,
    unMarkListFavorite,
    openNoSubscriptionModal,
    deleteTrashPermanently,
  } = props;

  const [window_width] = useWindowSize();
  const spacing: number = 30;
  let padding_ratio = 0.3;
  if (window_width <= 1400) padding_ratio = 0.2;
  if (window_width <= 1000) padding_ratio = 0.1;

  const content_width: number = (1 - padding_ratio) * window_width - (286 + 40);
  const max_columns: number = Math.floor(content_width / (75 + spacing));

  let allowed_width: number;
  if (lists.length + 1 >= max_columns) allowed_width = content_width;
  else allowed_width = (lists.length + 1) * (75 + spacing);

  let allowed_width_smart: number;
  if (smart_lists.length + 1 >= max_columns) allowed_width_smart = content_width;
  else allowed_width_smart = smart_lists.length * (75 + spacing);

  let allowed_width_favorites: number;
  if (favorite_lists.length + 1 >= max_columns) allowed_width_favorites = content_width;
  else allowed_width_favorites = favorite_lists.length * (75 + spacing);

  let allowed_width_trash: number;
  if (trash_lists.length + 1 >= max_columns) allowed_width_trash = content_width;
  else allowed_width_trash = trash_lists.length * (75 + spacing);

  let dampen_title_text: boolean = false;
  let dampen_smart_lists_title_text: boolean = false;
  let dampen_favorite_lists_title_text: boolean = false;
  let dampen_trash_lists_title_text: boolean = false;
  let lists_title_text = 'Lists';
  let smart_lists_title_text = 'Smart lists';
  let favorite_lists_title_text = 'Favorites';
  let trash_lists_title_text = 'Trash';

  if (searchValue.length > 0) {
    if (lists.length > 0) lists_title_text = `Lists found matching "${searchValue}"`;
    else {
      lists_title_text = 'No lists found';
      dampen_title_text = true;
    }

    if (smart_lists.length > 0) {
      smart_lists_title_text = `Smart lists found matching "${searchValue}"`;
    } else {
      smart_lists_title_text = 'No smart lists found';
      dampen_smart_lists_title_text = true;
    }

    if (favorite_lists.length > 0) {
      favorite_lists_title_text = `Favorites found matching "${searchValue}"`;
    } else {
      favorite_lists_title_text = 'No favorites found';
      dampen_favorite_lists_title_text = true;
    }

    if (trash_lists.length > 0) {
      trash_lists_title_text = `Trash found matching "${searchValue}"`;
    } else {
      trash_lists_title_text = 'No trash found';
      dampen_trash_lists_title_text = true;
    }
  }

  const activeSubscription: any = useSelector(selectActiveSubscription);
  const maxDisplay: number | null = activeSubscription?.details?.lists?.lists;

  const routerHistory = useHistory();

  const navCreateList = () => routerHistory.push('/s/lists/lists/new');

  const showListMenu = (event: any, list_id: string) => {
    closeItemMenu();
    const list = lists.find((i: any) => i.id === list_id);
    if (!list) return;
    const { top, bottom, left, right } = event.target.getBoundingClientRect();
    setSelectedItemPosition({
      top,
      bottom,
      left,
      right,
    });
    setSelectedList(list);
  };

  const showSmartListMenu = (event: any, smart_list_id: string) => {
    closeItemMenu();
    const smart_list = smart_lists.find((i: any) => i.id === smart_list_id);
    if (!smart_list) return;
    const { top, bottom, left, right } = event.target.getBoundingClientRect();
    setSelectedItemPosition({
      top,
      bottom,
      left,
      right,
    });
    setSelectedSmartList(smart_list);
  };

  const showTrashListMenu = (event: any, trash_list_id: string) => {
    closeItemMenu();
    const trash_list = trash_lists.find((i: any) => i.id === trash_list_id);
    if (!trash_list) return;
    const { top, bottom, left, right } = event.target.getBoundingClientRect();
    setSelectedItemPosition({
      top,
      bottom,
      left,
      right,
    });
    setSelectedTrashList(trash_list);
  };

  const closeItemMenu = () => {
    setSelectedList(null);
    setSelectedSmartList(null);
    setSelectedTrashList(null);
    setSelectedItemPosition({
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    });
  };

  const FilterComponent = () => (
    <Select
      color="#333333"
      size="sm"
      value={selectedTab}
      onChange={e => {
        selectTab(e.target.value);
      }}
    >
      {filterOptions.map((i: any) => (
        <option key={i.key} value={i.key}>
          {i.label}
        </option>
      ))}
    </Select>
  );

  return (
    <>
      <DeleteAllConfirmationDialog
        isOpen={isDeleteAllTrashDialogOpen}
        trashCount={trash_lists.length}
        onClose={closeDeleteAllTrashDialog}
        onProceed={deleteTrashPermanently}
      />
      <ListItemMenu
        targetPosition={selectedItemPosition}
        show={!!selectedList || !!selectedSmartList || !!selectedTrashList}
        initialData={selectedList || selectedSmartList || selectedTrashList}
        updateList={!!selectedSmartList ? updateSmartList : updateList}
        deleteList={!!selectedSmartList ? deleteSmartList : deleteList}
        deleteListPermanently={deleteListPermanently}
        restoreList={restoreList}
        markListFavorite={markListFavorite}
        unMarkListFavorite={unMarkListFavorite}
        is_favorite={props.favorites.includes(!!selectedList ? selectedList.id : '')}
        is_smart_list={!!selectedSmartList}
        is_initial_list={selectedList?.id === initial_list}
        is_trash={!!selectedTrashList}
        close={closeItemMenu}
        openNoSubscriptionModal={openNoSubscriptionModal}
      />
      <Box className="content">
        {selectedTab === 'lists' && (
          <>
            <Box
              paddingLeft={visualization === 'list' ? '8px' : '0px'}
              paddingRight={visualization === 'grid' ? '10px' : '0px'}
              className="section-title"
              alignItems="center"
            >
              <Box className={`title ${dampen_title_text && 'inactive'}`}>{lists_title_text}</Box>
              <FilterComponent />
            </Box>
            {visualization === 'grid' && (
              <SimpleGrid width={allowed_width} minChildWidth="75px" spacing="30px">
                {searchValue.length === 0 && <AddButtonGrid onClick={navCreateList} />}
                {lists.map((i: any, index: number) => (
                  <GridItem
                    key={i.id}
                    index={index}
                    {...i}
                    history={routerHistory}
                    showMenu={(event: any) => showListMenu(event, i.id)}
                    is_smart={false}
                    is_favorite={props.favorites.includes(i.id)}
                    is_initial={initial_list === i.id}
                    locked={maxDisplay ? index > maxDisplay - 1 : false}
                  />
                ))}
              </SimpleGrid>
            )}
            {visualization === 'list' && (
              <SimpleGrid columns={2} spacing="5px">
                <AddButtonList onClick={navCreateList} />
                {lists.map((i: List, index: number) => (
                  <ListItem
                    key={i.id}
                    {...i}
                    active={selectedList?.id === i.id}
                    history={routerHistory}
                    showMenu={(event: any) => showListMenu(event, i.id)}
                    is_smart={false}
                    is_favorite={props.favorites.includes(i.id)}
                    is_initial={initial_list === i.id}
                    locked={maxDisplay ? index > maxDisplay - 1 : false}
                  />
                ))}
              </SimpleGrid>
            )}
          </>
        )}
        {['all', 'smart'].includes(selectedTab) && (
          <>
            <Box
              marginTop={selectedTab === 'all' ? '35px' : '0px'}
              paddingLeft={visualization === 'list' ? '8px' : '0px'}
              paddingRight={visualization === 'grid' ? '10px' : '0px'}
              className="section-title"
            >
              <Stack isInline alignItems="center">
                <Box className={`title ${dampen_smart_lists_title_text && 'inactive'}`}>
                  {smart_lists_title_text}
                </Box>
                <Tooltip
                  zIndex={10000}
                  placement="right"
                  aria-label="Campaign smart sending"
                  label="A smart list is a list with one or more filters applied to it."
                >
                  <Icon size="0.8rem" name="info" color="gray.500" />
                </Tooltip>
              </Stack>
            </Box>

            {visualization === 'grid' && (
              <SimpleGrid width={allowed_width_smart} minChildWidth="75px" spacing="30px">
                {smart_lists.map((i: any, index: number) => (
                  <GridItem
                    key={i.id}
                    index={index}
                    {...i}
                    history={routerHistory}
                    showMenu={(event: any) => showSmartListMenu(event, i.id)}
                    is_smart
                    is_favorite={false}
                    is_initial={initial_list === i.id}
                    locked={maxDisplay ? index > maxDisplay - 1 : false}
                  />
                ))}
              </SimpleGrid>
            )}
            {visualization === 'list' && (
              <SimpleGrid columns={2} spacing="5px">
                {smart_lists.map((i: any, index: number) => (
                  <ListItem
                    key={i.id}
                    {...i}
                    active={selectedList?.id === i.id}
                    history={routerHistory}
                    showMenu={(event: any) => showSmartListMenu(event, i.id)}
                    is_smart={true}
                    is_favorite={false}
                    is_initial={initial_list === i.id}
                    locked={maxDisplay ? index > maxDisplay - 1 : false}
                  />
                ))}
              </SimpleGrid>
            )}
            {smart_lists.length === 0 && searchValue.length === 0 && (
              <Box color="#757575">No smart lists available</Box>
            )}
          </>
        )}
        {selectedTab === 'favorites' && (
          <>
            <Box
              paddingLeft={visualization === 'list' ? '8px' : '0px'}
              paddingRight={visualization === 'grid' ? '10px' : '0px'}
              className="section-title"
            >
              <Box className={`title ${dampen_favorite_lists_title_text && 'inactive'}`}>
                {favorite_lists_title_text}
              </Box>
              <FilterComponent />
            </Box>

            {visualization === 'grid' && (
              <SimpleGrid width={allowed_width_favorites} minChildWidth="75px" spacing="30px">
                {favorite_lists.map((i: any, index: number) => (
                  <GridItem
                    key={i.id}
                    index={index}
                    {...i}
                    history={routerHistory}
                    showMenu={(event: any) => showListMenu(event, i.id)}
                    is_initial={initial_list === i.id}
                    is_favorite
                    locked={maxDisplay ? index > maxDisplay - 1 : false}
                  />
                ))}
              </SimpleGrid>
            )}
            {visualization === 'list' && (
              <SimpleGrid columns={2} spacing="5px">
                {favorite_lists.map((i: any, index: number) => (
                  <ListItem
                    key={i.id}
                    {...i}
                    active={selectedList?.id === i.id}
                    history={routerHistory}
                    showMenu={(event: any) => showListMenu(event, i.id)}
                    is_initial={initial_list === i.id}
                    is_favorite
                    locked={maxDisplay ? index > maxDisplay - 1 : false}
                  />
                ))}
              </SimpleGrid>
            )}
            {favorite_lists.length === 0 && searchValue.length === 0 && (
              <Box color="#757575">No favorites available</Box>
            )}
          </>
        )}

        {selectedTab === 'trash' && (
          <>
            <Box
              paddingLeft={visualization === 'list' ? '8px' : '0px'}
              paddingRight={visualization === 'grid' ? '10px' : '0px'}
              className="section-title"
            >
              <div className={`title ${dampen_trash_lists_title_text && 'inactive'}`}>
                {trash_lists_title_text}
              </div>
              <Box display="flex" alignItems="center">
                <Button
                  variant="solid"
                  variantColor="red"
                  size="sm"
                  onClick={openDeleteAllTrashDialog}
                  isDisabled={trash_lists.length === 0}
                  mr="1rem"
                >
                  Delete All
                </Button>
                <FilterComponent />
              </Box>
            </Box>

            {visualization === 'grid' && (
              <SimpleGrid width={allowed_width_trash} minChildWidth="75px" spacing="30px">
                {trash_lists.map((i: any, index: number) => (
                  <GridItem
                    key={i.id}
                    index={index}
                    {...i}
                    history={routerHistory}
                    showMenu={(event: any) => showTrashListMenu(event, i.id)}
                    is_trash
                  />
                ))}
              </SimpleGrid>
            )}
            {visualization === 'list' && (
              <SimpleGrid columns={2} spacing="5px">
                {trash_lists.map((i: any) => (
                  <ListItem
                    key={i.id}
                    {...i}
                    active={selectedList?.id === i.id}
                    history={routerHistory}
                    showMenu={(event: any) => showTrashListMenu(event, i.id)}
                    is_trash
                  />
                ))}
              </SimpleGrid>
            )}
            {trash_lists.length === 0 && searchValue.length === 0 && (
              <Box color="#757575">No trash available</Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};
