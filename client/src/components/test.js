
export default class Utils{
	isOwner (a, b) {
		return (
			a.toString().toLowerCase()
				===
			b.toString().toLowerCase()
		)
	}
}