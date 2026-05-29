import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../api/client';
import { MapPin, Calendar, Plane, Hotel, AlertCircle, Sparkles } from 'lucide-react';
import SiteFooter from '../components/SiteFooter';

const SharedItinerary = () => {
  const { token } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sharedItinerary', token],
    queryFn: () => fetchClient(`/share/${token}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-md">
        <div className="loader-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <main className="max-w-max-width-desktop mx-auto px-md lg:px-lg py-xl min-h-[calc(100vh-80px)]">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-xl text-center">
          <div className="mx-auto mb-md w-14 h-14 rounded-full bg-error-container flex items-center justify-center">
            <AlertCircle className="text-error" />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Itinerary not found</h2>
          <p className="text-on-surface-variant mb-lg">
            This itinerary might be private, expired, or doesn’t exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all"
          >
            Create your own
          </Link>
        </div>
      </main>
    );
  }

  const { itinerary } = data;
  const content = itinerary.generatedContent;

  return (
    <>
      <main className="max-w-max-width-desktop mx-auto px-md lg:px-lg py-lg min-h-[calc(100vh-80px)]">
      <div className="mb-lg text-center">
        <div className="inline-flex items-center gap-xs bg-primary/5 text-primary px-md py-xs rounded-full font-label-md">
          <Sparkles size={16} />
          Shared itinerary via Tourify
        </div>
      </div>

      {/* Header */}
      <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-lg lg:p-xl trip-card-shadow overflow-hidden relative">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-tertiary-fixed-dim/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="font-display-lg text-display-lg text-on-surface break-words">{itinerary.title}</h1>
          <p className="mt-sm flex flex-wrap items-center gap-xs text-on-surface-variant">
            <MapPin size={18} className="text-primary" />
            <span className="font-label-md">{content.destination}</span>
          </p>

          {content.summary && (
            <p className="mt-md text-body-md text-on-surface-variant leading-relaxed">
              {content.summary}
            </p>
          )}
        </div>
      </section>

      {/* Logistics */}
      <section className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-md">
        {content.flightDetails && content.flightDetails.airline && (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-md trip-card-shadow">
            <h2 className="font-headline-md text-headline-md flex items-center gap-sm mb-sm">
              <Plane size={18} className="text-secondary" />
              Flight information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-sm text-on-surface-variant">
              <div>
                <dt className="text-label-sm uppercase tracking-wide text-outline">Airline</dt>
                <dd className="font-label-md text-on-surface break-words">
                  {content.flightDetails.airline} ({content.flightDetails.flightNo})
                </dd>
              </div>
              <div>
                <dt className="text-label-sm uppercase tracking-wide text-outline">Departure</dt>
                <dd className="font-label-md text-on-surface break-words">{content.flightDetails.departure}</dd>
              </div>
              <div>
                <dt className="text-label-sm uppercase tracking-wide text-outline">Arrival</dt>
                <dd className="font-label-md text-on-surface break-words">{content.flightDetails.arrival}</dd>
              </div>
            </dl>
          </div>
        )}

        {content.hotelDetails && content.hotelDetails.name && (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-md trip-card-shadow">
            <h2 className="font-headline-md text-headline-md flex items-center gap-sm mb-sm">
              <Hotel size={18} className="text-primary" />
              Accommodation
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-sm text-on-surface-variant">
              <div className="sm:col-span-2">
                <dt className="text-label-sm uppercase tracking-wide text-outline">Hotel</dt>
                <dd className="font-label-md text-on-surface break-words">{content.hotelDetails.name}</dd>
              </div>
              <div>
                <dt className="text-label-sm uppercase tracking-wide text-outline">Check in</dt>
                <dd className="font-label-md text-on-surface">{content.hotelDetails.checkIn}</dd>
              </div>
              <div>
                <dt className="text-label-sm uppercase tracking-wide text-outline">Check out</dt>
                <dd className="font-label-md text-on-surface">{content.hotelDetails.checkOut}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-label-sm uppercase tracking-wide text-outline">Room type</dt>
                <dd className="font-label-md text-on-surface break-words">{content.hotelDetails.roomType}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      {/* Daily plan + tips */}
      {content.dailyPlan && content.dailyPlan.length > 0 && (
        <section className="mt-xl">
          <h2 className="font-headline-md text-headline-md flex items-center gap-sm mb-md">
            <Calendar size={18} className="text-primary" />
            Daily itinerary
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
            <div className="lg:col-span-8 space-y-md">
              {content.dailyPlan.map((day, index) => (
                <div key={index} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-md trip-card-shadow">
                  <div className="flex flex-wrap items-baseline justify-between gap-sm mb-sm">
                    <div className="flex items-baseline gap-sm">
                      <h3 className="font-headline-md text-on-surface">Day {day.day}</h3>
                      {day.date && <span className="text-label-sm text-on-surface-variant">{day.date}</span>}
                    </div>
                  </div>
                  <ul className="space-y-sm">
                    {day.activities.map((activity, actIndex) => (
                      <li key={actIndex} className="flex gap-sm items-start">
                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">trip_origin</span>
                        <span className="text-body-md text-on-surface break-words">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <aside className="lg:col-span-4 space-y-md">
              {content.travelTips && content.travelTips.length > 0 && (
                <div className="glass-panel bg-primary/5 rounded-2xl p-md border border-primary/20">
                  <h3 className="font-headline-md text-on-surface mb-sm">Travel tips</h3>
                  <ul className="space-y-2">
                    {content.travelTips.map((tip, i) => (
                      <li key={i} className="flex gap-sm items-start">
                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                        <span className="text-body-md text-on-surface break-words">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-md trip-card-shadow">
                <h3 className="font-headline-md text-on-surface mb-xs">Want your own AI travel agent?</h3>
                <p className="text-on-surface-variant mb-md">Upload your bookings and get a full itinerary in minutes.</p>
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all"
                >
                  Try Tourify for free
                </Link>
              </div>
            </aside>
          </div>
        </section>
      )}
      </main>
      <SiteFooter />
    </>
  );
};

export default SharedItinerary;
