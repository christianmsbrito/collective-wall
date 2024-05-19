class Composition < ApplicationRecord
  belongs_to :composable, polymorphic: true
end
