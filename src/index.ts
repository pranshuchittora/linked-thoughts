import { initUprtcl } from './services/init';
import { App } from './app';
import { DashboardElement } from './containers/dashboard';
import { NavSectionElement } from './containers/NavBar/nav.section';
import { PageItemElement } from './containers/NavBar/nav.page.item';
import { GettingStartedElement } from './containers/getting-started';
import { SectionPage } from './containers/SectionPage/section.page';
import { VisitorElement } from './containers/visitor';
import { DocumentPage } from './containers/DocPage/doc.page';
import { ErrorPage } from './containers/ErrorPage/Error.page';
import ExploreCard from './containers/ExploreCard/Explore.section';
import SearchListItem from './components/SearchListItem/Search.ListItem';
import ClipboardListItem from './components/SearchListItem/Clipboard.ListItem';
import ReadOnlyPage from './containers/ReadOnlyPage/ReadOnly.page';
import LTIntersectionObserver from './containers/IntersectionObserver/IntersectionObserver';
import UserPage from './containers/UserBlog/User.page';
import UserPageBlogSection from './containers/UserBlog/User.BlogSection';
import UserPageBlogSectionItem from './containers/UserBlog/User.BlogSection.Item';
import AppBarPublic from './components/PublicAppBar/Appbar.public';
// 3rd Party Components
import '@ui5/webcomponents/dist/Carousel';
import { BlockInfoPopper } from './containers/BlockInfo/block-info';
// Forks
import { ForksPage } from './containers/Collections/Implementations/Forks.section';
import { AppTestElement } from './containers/Test/app.e2e.test';
import { BlockNotFound } from './components/BlockNotFound/BlockNotFound';
import { GridCardItem } from './containers/Collections/Items/grid-card';
import { TableRowItem } from './containers/Collections/Items/table-row';

(async function () {
  await initUprtcl();

  customElements.define('intercreativity-app', App);
  customElements.define('app-dashboard', DashboardElement);
  customElements.define('app-nav-section', NavSectionElement);
  customElements.define('app-nav-page-item', PageItemElement);
  customElements.define('app-getting-started', GettingStartedElement);
  customElements.define('app-visitor', VisitorElement);
  customElements.define('app-section-page', SectionPage);
  customElements.define('app-document-page', DocumentPage);
  customElements.define('app-error-page', ErrorPage);
  customElements.define('app-explore-card', ExploreCard);
  customElements.define('app-explore-list-item', SearchListItem);
  customElements.define('app-explore-clipboard-list-item', ClipboardListItem);
  customElements.define('app-read-only-page', ReadOnlyPage);
  customElements.define('app-intersection-observer', LTIntersectionObserver);
  customElements.define('app-user-page', UserPage);
  customElements.define('app-user-page-blog-section', UserPageBlogSection);
  customElements.define(
    'app-user-page-blog-section-item',
    UserPageBlogSectionItem
  );
  customElements.define('app-appbar-public', AppBarPublic);
  customElements.define('app-block-info', BlockInfoPopper);
  // Collections
  customElements.define('app-item-grid-card', GridCardItem);
  customElements.define('app-item-table-row', TableRowItem);

  // Forks
  customElements.define('app-forks-page', ForksPage);

  customElements.define('app-test', AppTestElement);
  customElements.define('app-error-block-not-found', BlockNotFound);
})();
