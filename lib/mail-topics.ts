// Public SSR facade. Private topic fields never cross the page boundary.
import { windChime } from './windchime';
export type { WindChimePublicTopic as Topic } from '@windchime/embed/core';
export const getTopicById = (id: string) => windChime.getPublicTopic(id);
export const getTopicBySlug = (slug: string) => windChime.getPublicTopic(slug);
export const getDefaultTopic = () => windChime.getPublicTopic('default');
export const listTopics = (_options?: { onlyPublicActive?: boolean }) => windChime.listPublicTopics();
