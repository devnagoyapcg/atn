package dfa.gov.nagoyapcg.atn.db.models

data class UserModel(
    var id: Int = 0,
    var user: String = "",
    var lastName: String = "",
    var firstName: String = "",
) {
    fun toMap(): Map<String, Any> {
        return mapOf(
            "id"        to id,
            "user"      to user,
            "lastName"  to lastName,
            "firstName" to firstName
        )
    }
}