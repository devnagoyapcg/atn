package dfa.gov.nagoyapcg.atn.db.models

data class LinkModel(
    var text: String = "",
    var link: String = "",
    var color: String = ""
) {
    fun toMap(): Map<String, Any> {
        return mapOf(
            "text" to text,
            "link" to link,
            "color" to color
        )
    }
}
