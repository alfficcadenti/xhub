import moment from 'moment';

export function formatDurationToHours(duration) {
    return moment.utc(moment.duration(duration/1000, "seconds").asMilliseconds()).format('HH:mm:ss')
}