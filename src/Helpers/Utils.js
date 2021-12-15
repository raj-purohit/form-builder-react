export function RandomId() {
    return Math.random().toString(36).substring(2,12)
}