package dfa.gov.nagoyapcg.atn.db.models

data class CaseModel(
    var id: Int = 0,
    var lastName: String = "",
    var firstName: String = "",
    var middleName: String = "",
    var birthday: String = "",
    var birthPlace: String = "",
    var gender: String = "",
    var dateRecorded: String = "",
    var case: String = "",
    var action: String = "",
    var status: String = "",
    var others: String = ""
) {
    fun toMap(): Map<String, Any> {
        return mapOf(
            "id" to id,
            "lastName" to lastName,
            "firstName" to firstName,
            "middleName" to middleName,
            "birthday" to birthday,
            "birthPlace" to birthPlace,
            "gender" to gender,
            "dateRecorded" to dateRecorded,
            "case" to case,
            "remarks" to action,
            "status" to status,
            "others" to others
        )
    }
}