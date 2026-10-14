import type { Access } from 'payload'

/** Herkes erişebilir (ziyaretçiler dahil). */
export const anyone: Access = () => true

/** Sadece giriş yapmış admin kullanıcıları erişebilir. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/**
 * Adminler her kaydı görür; ziyaretçiler sadece yayınlanmış olanları.
 * Taslak makalelerin sitede görünmesini bu kural engeller.
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
